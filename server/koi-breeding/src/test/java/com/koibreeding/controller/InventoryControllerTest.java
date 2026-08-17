package com.koibreeding.controller;

import com.koibreeding.dto.response.ResItemInventory;
import com.koibreeding.enums.EffectType;
import com.koibreeding.enums.ItemType;
import com.koibreeding.service.InventoryService;
import com.koibreeding.util.error.IdInvalidException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InventoryControllerTest {

    @Mock
    private InventoryService inventoryService;

    @InjectMocks
    private InventoryController inventoryController;

    private ResItemInventory response;
    private ResItemInventory response1;

    @BeforeEach
    void initData() {
        response = ResItemInventory.builder()
                .name("Koi Food - Bethech")
                .price(BigDecimal.valueOf(25))
                .itemType(ItemType.FOOD)
                .effectType(EffectType.GROWTH)
                .description("Standard food that restores 30 food points.")
                .quantity(10)
                .build();

        response1 = ResItemInventory.builder()
                .name("Koi Food - Ipick")
                .price(BigDecimal.valueOf(40))
                .itemType(ItemType.FOOD)
                .effectType(EffectType.GROWTH)
                .description("Premium food that restores 50 food points.")
                .quantity(10)
                .build();
    }

    @Test
    void getInventory_success() {

        // GIVEN
        when(inventoryService.getInventory(1))
                .thenReturn(List.of(response, response1));

        // WHEN
        ResponseEntity<List<ResItemInventory>> result =
                inventoryController.getInventory(1);

        // THEN
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertEquals(2, result.getBody().size());

        assertEquals("Koi Food - Bethech", result.getBody().get(0).getName());
        assertEquals(BigDecimal.valueOf(25), result.getBody().get(0).getPrice());

        assertEquals(ItemType.FOOD, result.getBody().get(0).getItemType());
        assertEquals(EffectType.GROWTH, result.getBody().get(0).getEffectType());

        assertEquals("Standard food that restores 30 food points.", result.getBody().get(0).getDescription());

        assertEquals(10, result.getBody().get(0).getQuantity()
        );

        assertEquals("Koi Food - Ipick", result.getBody().get(1).getName()
        );

        assertEquals(BigDecimal.valueOf(40), result.getBody().get(1).getPrice()
        );

        assertEquals(ItemType.FOOD, result.getBody().get(1).getItemType()
        );

        assertEquals(EffectType.GROWTH, result.getBody().get(1).getEffectType()
        );

        assertEquals("Premium food that restores 50 food points.", result.getBody().get(1).getDescription()
        );

        assertEquals(10, result.getBody().get(1).getQuantity()
        );
    }

    @Test
    void getInventory_notFound() {
        //GIVEN
        when(inventoryService.getInventory(1))
                .thenReturn(null);
        // WHEN
        ResponseEntity<List<ResItemInventory>> response =
                inventoryController.getInventory(1);
        //THEN
        assertNull(response.getBody());
        verify(inventoryService).getInventory(1);
    }

    @Test
    void getInventory_userIdMissing() {
        // WHEN + THEN
        IdInvalidException exception = assertThrows(
                IdInvalidException.class,
                () -> inventoryController.getInventory(null)
        );

        assertEquals("inventory with userId null not found", exception.getMessage());
    }

    @Test
    void addItemToInventory_success() {
        //GIVEN
        when(inventoryService.addItemToInventory(1, 1, response.getQuantity()))
                .thenReturn(response);

        //WHEN
        ResponseEntity<ResItemInventory> result = inventoryController
                .addItemToInventory(1, 1, response);

        //THEN
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertEquals(response, result.getBody());
    }

    @Test
    void addItemToInventory_notFoundItemId() {
        //WHEN + THEN
        IdInvalidException exception = assertThrows(
                IdInvalidException.class,
                () -> inventoryController.addItemToInventory(1, null, response)
        );

        assertEquals("inventory with itemId null not found", exception.getMessage());
        verifyNoInteractions(inventoryService);
    }

    @Test
    void addItemToInventory_notFoundUserId() {
        //WHEN + THEN
        IdInvalidException exception = assertThrows(
                IdInvalidException.class,
                () -> inventoryController.addItemToInventory(null, 1, response)
        );

        assertEquals("inventory with userId null not found", exception.getMessage());
        verifyNoInteractions(inventoryService);
    }

    @Test
    void useItemFromInventory_success() {
        //GIVEN
        when(inventoryService.addItemToInventory(1, 1, response.getQuantity()))
                .thenReturn(response);

        //WHEN
        ResponseEntity<ResItemInventory> result = inventoryController
                .addItemToInventory(1, 1, response);

        //THEN
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertEquals(response, result.getBody());
    }

    @Test
    void useItemFromInventory_notFoundItemId() {
        //WHEN + THEN
        IdInvalidException exception = assertThrows(
                IdInvalidException.class,
                () -> inventoryController.addItemToInventory(1, null, response)
        );

        assertEquals("inventory with itemId null not found", exception.getMessage());
        verifyNoInteractions(inventoryService);
    }

    @Test
    void useItemFromInventory_notFoundUserId() {
        //WHEN + THEN
        IdInvalidException exception = assertThrows(
                IdInvalidException.class,
                () -> inventoryController.addItemToInventory(null, 1, response)
        );

        assertEquals("inventory with userId null not found", exception.getMessage());
        verifyNoInteractions(inventoryService);
    }
}