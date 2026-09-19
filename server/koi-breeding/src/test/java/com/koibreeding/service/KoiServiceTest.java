package com.koibreeding.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.koibreeding.domain.Inventory;
import com.koibreeding.domain.Item;
import com.koibreeding.domain.Koi;
import com.koibreeding.domain.Pond;
import com.koibreeding.domain.User;
import com.koibreeding.dto.request.RequestFeedKoiDTO;
import com.koibreeding.dto.request.RequestMoveKoiDTO;
import com.koibreeding.dto.response.ResFeedKoiDTO;
import com.koibreeding.dto.response.ResItemInventory;
import com.koibreeding.enums.ItemType;
import com.koibreeding.enums.EffectType;
import com.koibreeding.dto.request.RequestHealKoiDTO;
import com.koibreeding.repository.InventoryRepository;
import com.koibreeding.enums.BreedingStatus;
import com.koibreeding.repository.BreedingEventRepository;
import com.koibreeding.repository.KoiRepository;
import com.koibreeding.util.formulas.KoiFormula;

@ExtendWith(MockitoExtension.class)
class KoiServiceTest {

    @Mock
    private KoiRepository koiRepository;
    @Mock
    private BreedingEventRepository breedingEventRepository;
    @Mock
    private MutationService mutationService;
    @Mock
    private DictionaryService dictionaryService;
    @Mock
    private PondService pondService;
    @Mock
    private InventoryService inventoryService;
    @Mock
    private KoiFormula koiFormula;

    @Mock
    private InventoryRepository inventoryRepository;
    @Mock
    private KoiCareService koiCareService;
    @Mock
    private jakarta.persistence.EntityManager entityManager;

    private KoiService koiService;
    private Koi koi;
    private Inventory inventory;

    @BeforeEach
    void setUp() {
        koiService = new KoiService(koiRepository, mutationService, dictionaryService, pondService,
                inventoryService, koiFormula, breedingEventRepository, inventoryRepository, koiCareService, entityManager);

        User owner = new User();
        owner.setId(1);
        owner.setUsername("owner");

        Pond pond = new Pond();
        pond.setId(10);
        pond.setOwner(owner);

        koi = new Koi();
        koi.setId(20);
        koi.setName("Kohaku");
        koi.setFoodBar(70);
        koi.setBornedAt(OffsetDateTime.now());
        koi.setPond(pond);

        Item food = new Item();
        food.setId(30);
        food.setItemType(ItemType.FOOD);
        food.setEffectValue(BigDecimal.valueOf(20));

        inventory = new Inventory();
        inventory.setUser(owner);
        inventory.setItem(food);
        inventory.setQuantity(5);
    }

    @Test
    void ownedProfileIncludesParentOwnership() {
        Koi father = new Koi();
        father.setId(21);
        father.setPond(koi.getPond());
        koi.setFather(father);
        User otherOwner = new User();
        otherOwner.setId(2);
        Pond otherPond = new Pond();
        otherPond.setOwner(otherOwner);
        Koi mother = new Koi();
        mother.setId(22);
        mother.setPond(otherPond);
        koi.setMother(mother);
        when(koiRepository.findById(20)).thenReturn(Optional.of(koi));

        var profile = koiService.fetchOwnedProfile(20, 1);
        assertEquals(true, profile.getFather().isBelongToUser());
        assertEquals(false, profile.getMother().isBelongToUser());
    }

    @Test
    void profileRejectsAnotherOwner() {
        when(koiRepository.findById(20)).thenReturn(Optional.of(koi));
        var error = assertThrows(ResponseStatusException.class, () -> koiService.fetchOwnedProfile(20, 2));
        assertEquals(HttpStatus.FORBIDDEN, error.getStatusCode());
    }

    @Test
    void profileRejectsMissingKoi() {
        var error = assertThrows(ResponseStatusException.class, () -> koiService.fetchOwnedProfile(999, 1));
        assertEquals(HttpStatus.NOT_FOUND, error.getStatusCode());
    }

    @Test
    void moveKoiRejectsActiveBreedingWithoutChangingPond() {
        Pond originalPond = koi.getPond();
        RequestMoveKoiDTO request = new RequestMoveKoiDTO();
        request.setTargetKoiId(20);
        request.setSourcePondId(999);
        request.setTargetPondId(11);
        when(koiRepository.findById(20)).thenReturn(Optional.of(koi));
        when(breedingEventRepository.existsByUserAndParentKoiAndStatusNotIn(
                1, 20, List.of(BreedingStatus.COMPLETED, BreedingStatus.CANCELLED))).thenReturn(true);

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> koiService.handleMoveKoi(request));

        assertEquals(HttpStatus.CONFLICT, exception.getStatusCode());
        assertEquals(originalPond, koi.getPond());
        verify(koiRepository, never()).save(koi);
    }

    @Test
    void moveKoiSucceedsWhenNoActiveBreedingExists() throws Exception {
        Pond targetPond = new Pond();
        targetPond.setId(11);
        targetPond.setOwner(koi.getPond().getOwner());
        targetPond.setCapacity(5);
        RequestMoveKoiDTO request = new RequestMoveKoiDTO();
        request.setTargetKoiId(20);
        request.setSourcePondId(10);
        request.setTargetPondId(11);
        when(koiRepository.findById(20)).thenReturn(Optional.of(koi));
        when(breedingEventRepository.existsByUserAndParentKoiAndStatusNotIn(
                1, 20, List.of(BreedingStatus.COMPLETED, BreedingStatus.CANCELLED))).thenReturn(false);
        when(pondService.handleFetchPondById(10)).thenReturn(koi.getPond());
        when(pondService.handleFetchPondById(11)).thenReturn(targetPond);
        when(koiRepository.save(koi)).thenReturn(koi);

        assertEquals(11, koiService.handleMoveKoi(request).getPondId());
        assertEquals(targetPond, koi.getPond());
        verify(koiRepository).save(koi);
    }

    @Test
    void medicineRestoresHealthAndConsumesOneItem() {
        koi.setHealth(90);
        inventory.getItem().setItemType(ItemType.MEDICINE);
        inventory.getItem().setEffectType(EffectType.HEALTH);
        when(koiRepository.findById(20)).thenReturn(Optional.of(koi));
        when(inventoryRepository.findByUserIdAndItemId(1, 30)).thenReturn(Optional.of(inventory));
        when(koiRepository.save(koi)).thenReturn(koi);

        var result = koiService.handleHealKoi(20, new RequestHealKoiDTO(1, 30, 1));

        assertEquals(100, result.koi().getHealth());
        assertEquals(10, result.healthRestored());
        assertEquals(4, result.remainingItemQuantity());
        verify(inventoryRepository).save(inventory);
    }

    @Test
    void fullHealthDoesNotConsumeMedicine() {
        when(koiRepository.findById(20)).thenReturn(Optional.of(koi));
        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> koiService.handleHealKoi(20, new RequestHealKoiDTO(1, 30, 1)));
        assertEquals(HttpStatus.CONFLICT, error.getStatusCode());
        org.mockito.Mockito.verifyNoInteractions(inventoryRepository);
        verify(koiRepository, never()).save(koi);
    }

    @Test
    void nonOwnerCannotUseMedicine() {
        koi.setHealth(50);
        when(koiRepository.findById(20)).thenReturn(Optional.of(koi));
        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> koiService.handleHealKoi(20, new RequestHealKoiDTO(2, 30, 1)));
        assertEquals(HttpStatus.FORBIDDEN, error.getStatusCode());
        org.mockito.Mockito.verifyNoInteractions(inventoryRepository, koiCareService);
    }

    @Test
    void pondMedicineCannotHealKoi() {
        koi.setHealth(50);
        inventory.getItem().setItemType(ItemType.MEDICINE);
        inventory.getItem().setEffectType(EffectType.WATER_QUALITY);
        when(koiRepository.findById(20)).thenReturn(Optional.of(koi));
        when(inventoryRepository.findByUserIdAndItemId(1, 30)).thenReturn(Optional.of(inventory));
        assertThrows(ResponseStatusException.class,
                () -> koiService.handleHealKoi(20, new RequestHealKoiDTO(1, 30, 1)));
        assertEquals(50, koi.getHealth());
        verify(inventoryRepository, never()).save(inventory);
        verify(inventoryRepository, never()).delete(inventory);
    }

    @Test
    void insufficientMedicineDoesNotChangeHealth() {
        koi.setHealth(50);
        inventory.getItem().setItemType(ItemType.MEDICINE);
        inventory.getItem().setEffectType(EffectType.HEALTH);
        when(koiRepository.findById(20)).thenReturn(Optional.of(koi));
        when(inventoryRepository.findByUserIdAndItemId(1, 30)).thenReturn(Optional.of(inventory));
        assertThrows(ResponseStatusException.class,
                () -> koiService.handleHealKoi(20, new RequestHealKoiDTO(1, 30, 6)));
        assertEquals(50, koi.getHealth());
        verify(inventoryRepository, never()).save(inventory);
    }

    @Test
    void lastMedicineIsRemovedFromInventory() {
        koi.setHealth(0);
        inventory.setQuantity(1);
        inventory.getItem().setItemType(ItemType.MEDICINE);
        inventory.getItem().setEffectType(EffectType.HEALTH);
        when(koiRepository.findById(20)).thenReturn(Optional.of(koi));
        when(inventoryRepository.findByUserIdAndItemId(1, 30)).thenReturn(Optional.of(inventory));
        when(koiRepository.save(koi)).thenReturn(koi);
        var result = koiService.handleHealKoi(20, new RequestHealKoiDTO(1, 30, 1));
        assertEquals(20, result.koi().getHealth());
        assertEquals(0, result.remainingItemQuantity());
        verify(inventoryRepository).delete(inventory);
    }

    @Test
    void feedKoiRestoresFoodBarAndConsumesInventory() {
        koi.setHungrySince(OffsetDateTime.now().minusHours(3));
        RequestFeedKoiDTO request = new RequestFeedKoiDTO(1, 30, 2);
        ResItemInventory remaining = new ResItemInventory();
        remaining.setQuantity(3);

        when(koiRepository.findById(20)).thenReturn(Optional.of(koi));
        when(inventoryService.handleFetchInventoryByUserAndItem(1, 30)).thenReturn(inventory);
        when(koiRepository.save(koi)).thenReturn(koi);
        when(inventoryService.useItemFromInventory(1, 30, 2)).thenReturn(remaining);

        ResFeedKoiDTO result = koiService.handleFeedKoi(20, request);

        assertEquals(100, result.koi().getFoodBar());
        assertEquals(null, koi.getHungrySince());
        assertEquals(30, result.foodRestored());
        assertEquals(2, result.itemsUsed());
        assertEquals(3, result.remainingItemQuantity());
        verify(koiRepository).save(koi);
        verify(inventoryService).useItemFromInventory(1, 30, 2);
    }

    @Test
    void feedKoiRejectsNonOwner() {
        RequestFeedKoiDTO request = new RequestFeedKoiDTO(2, 30, 1);
        when(koiRepository.findById(20)).thenReturn(Optional.of(koi));

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> koiService.handleFeedKoi(20, request));

        assertEquals(HttpStatus.FORBIDDEN, exception.getStatusCode());
        verify(inventoryService, never()).useItemFromInventory(2, 30, 1);
        verify(koiRepository, never()).save(koi);
    }
}
