package com.koibreeding.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Optional;

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
import com.koibreeding.dto.response.ResFeedKoiDTO;
import com.koibreeding.dto.response.ResItemInventory;
import com.koibreeding.enums.ItemType;
import com.koibreeding.repository.KoiRepository;
import com.koibreeding.util.formulas.KoiFormula;

@ExtendWith(MockitoExtension.class)
class KoiServiceTest {

    @Mock
    private KoiRepository koiRepository;
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

    private KoiService koiService;
    private Koi koi;
    private Inventory inventory;

    @BeforeEach
    void setUp() {
        koiService = new KoiService(koiRepository, mutationService, dictionaryService, pondService,
                inventoryService, koiFormula);

        User owner = new User();
        owner.setId(1);

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
    void feedKoiRestoresFoodBarAndConsumesInventory() {
        RequestFeedKoiDTO request = new RequestFeedKoiDTO(1, 30, 2);
        ResItemInventory remaining = new ResItemInventory();
        remaining.setQuantity(3);

        when(koiRepository.findById(20)).thenReturn(Optional.of(koi));
        when(inventoryService.handleFetchInventoryByUserAndItem(1, 30)).thenReturn(inventory);
        when(koiRepository.save(koi)).thenReturn(koi);
        when(inventoryService.useItemFromInventory(1, 30, 2)).thenReturn(remaining);

        ResFeedKoiDTO result = koiService.handleFeedKoi(20, request);

        assertEquals(100, result.koi().getFoodBar());
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
