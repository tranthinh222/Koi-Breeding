package com.koibreeding.service;

import com.koibreeding.domain.Inventory;
import com.koibreeding.domain.Item;
import com.koibreeding.domain.User;
import com.koibreeding.dto.response.ResItemInventory;
import com.koibreeding.enums.EffectType;
import com.koibreeding.enums.ItemType;
import com.koibreeding.repository.InventoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InventoryServiceTest {

    @Mock
    private InventoryRepository inventoryRepository;

    @Mock
    private UserService userService;

    @Mock
    private ItemService itemService;

    @InjectMocks
    private InventoryService inventoryService;

    private User user;
    private Item item;
    private Inventory inventory;

    @BeforeEach
    void initData() {

        user = new User();
        user.setId(1);

        item = new Item();
        item.setId(1);
        item.setName("Koi Food - Bethech");
        item.setPrice(BigDecimal.valueOf(25));
        item.setItemType(ItemType.FOOD);
        item.setEffectType(EffectType.GROWTH);
        item.setDescription("Standard food that restores 30 food points.");

        inventory = new Inventory();
        inventory.setUser(user);
        inventory.setItem(item);
        inventory.setQuantity(10);
    }

    @Test
    void getInventory_success() {

        // GIVEN
        when(inventoryRepository.findByUserId(1))
                .thenReturn(List.of(inventory));

        // WHEN
        List<ResItemInventory> result =
                inventoryService.getInventory(1);

        // THEN
        assertEquals(1, result.size());
        assertEquals("Koi Food - Bethech", result.get(0).getName());
        assertEquals(BigDecimal.valueOf(25), result.get(0).getPrice());

        assertEquals(ItemType.FOOD, result.get(0).getItemType());
        assertEquals(EffectType.GROWTH, result.get(0).getEffectType());

        assertEquals("Standard food that restores 30 food points.", result.get(0).getDescription());
        assertEquals(10, result.get(0).getQuantity());
    }

    @Test
    void getInventory_notFindInventory(){
        //GIVEN
        when(inventoryRepository.findByUserId(null))
                .thenReturn(null);
        //WHEN + THEN
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> inventoryService.getInventory(null)
        );
        assertEquals("not found inventory", exception.getMessage());
    }

    @Test
    void addItemToInventory_success() {

        // GIVEN
        when(inventoryRepository.findByUserIdAndItemId(1, 1))
                .thenReturn(Optional.empty());

        when(userService.handleFetchUserById(1))
                .thenReturn(user);

        when(itemService.findItemById(1))
                .thenReturn(item);

        when(inventoryRepository.save(any(Inventory.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // WHEN
        ResItemInventory result =
                inventoryService.addItemToInventory(1, 1, 5
                );

        // THEN
        assertNotNull(result);
        assertEquals("Koi Food - Bethech", result.getName());
        assertEquals(BigDecimal.valueOf(25), result.getPrice());

        assertEquals(ItemType.FOOD, result.getItemType());
        assertEquals(EffectType.GROWTH, result.getEffectType());

        assertEquals("Standard food that restores 30 food points.", result.getDescription());
        assertEquals(5, result.getQuantity());
    }

    @Test
    void addItemToInventory_notFoundUserId(){
        //GIVEN
        when(inventoryRepository.findByUserIdAndItemId(null,1))
                .thenReturn(Optional.empty());
        when(userService.handleFetchUserById(null))
                .thenReturn(null);
        //When + Then
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> inventoryService.addItemToInventory(null,1,1)
        );
        assertEquals("not found user", exception.getMessage());
    }

    @Test
    void addItemToInventory_notFoundItemId(){
        //GIVEN
        when(inventoryRepository.findByUserIdAndItemId(1,null))
                .thenReturn(Optional.empty());
        when(userService.handleFetchUserById(1))
                .thenReturn(user);
        when(itemService.findItemById(null))
                .thenReturn(null);
        //When + Then
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> inventoryService.addItemToInventory(1,null,1)
        );
        assertEquals("not found item", exception.getMessage());
    }

    @Test
    void addItemToInventory_InventoryNull(){
        //GIVEN
        when(inventoryRepository.findByUserIdAndItemId(1,1))
                .thenReturn(Optional.empty());
        when(userService.handleFetchUserById(1))
                .thenReturn(user);
        when(itemService.findItemById(1))
                .thenReturn(item);

        when(inventoryRepository.save(any(Inventory.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ResItemInventory result = inventoryService.addItemToInventory(1, 1, 5);

        assertNotNull(result);
        assertEquals("Koi Food - Bethech", result.getName());
        assertEquals(BigDecimal.valueOf(25), result.getPrice());

        assertEquals(ItemType.FOOD, result.getItemType());
        assertEquals(EffectType.GROWTH, result.getEffectType());

        assertEquals("Standard food that restores 30 food points.", result.getDescription());
        assertEquals(5, result.getQuantity());

    }

    @Test
    void useItemFromInventory_success() {

        // GIVEN
        when(inventoryRepository.findByUserIdAndItemId(1, 1))
                .thenReturn(Optional.of(inventory));

        when(inventoryRepository.save(inventory))
                .thenReturn(inventory);

        // WHEN
        ResItemInventory result =
                inventoryService.useItemFromInventory(1, 1, 3);

        // THEN
        assertEquals(7, result.getQuantity());
    }

    @Test
    void useItemFromInventory_notFindUserId() {
        // GIVEN
        when(inventoryRepository.findByUserIdAndItemId(null, 1))
                .thenReturn(Optional.empty());

        // WHEN
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> inventoryService.useItemFromInventory(null, 1, 3)
        );

        // THEN
        assertEquals("not found item", exception.getMessage());
    }

    @Test
    void useItemFromInventory_notFindItemId() {
        // GIVEN
        when(inventoryRepository.findByUserIdAndItemId(1, null))
                .thenReturn(Optional.empty());

        // WHEN
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> inventoryService.useItemFromInventory(1, null, 3)
        );

        // THEN
        assertEquals("not found item", exception.getMessage());
    }

    @Test
    void useItemFromInventory_useItemToZero() {
        // GIVEN
        when(inventoryRepository.findByUserIdAndItemId(1, 1))
                .thenReturn(Optional.of(inventory));

        // WHEN
        ResItemInventory result =
                inventoryService.useItemFromInventory(1, 1, 10);

        // THEN
        assertEquals(0, result.getQuantity());
        verify(inventoryRepository, times(1)).delete(inventory);
        verify(inventoryRepository, never()).save(any());
    }
    @Test
    void useItemFromInventory_QuantitySmollerZero() {
        // WHEN + THEN
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> inventoryService.useItemFromInventory(1, 1, -1)
        );
        assertEquals("Quantity must be at least 1", exception.getMessage());

    }
}



