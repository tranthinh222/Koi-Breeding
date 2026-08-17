package com.koibreeding.controller;

import com.koibreeding.domain.Item;
import com.koibreeding.dto.request.PurchaseRequest;
import com.koibreeding.dto.response.ResPurchaseDto;
import com.koibreeding.dto.response.ResTransactionDto;
import com.koibreeding.enums.ItemType;
import com.koibreeding.enums.TransactionStatus;
import com.koibreeding.enums.TransactionType;
import com.koibreeding.service.ShopService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ShopControllerTest {

    @Mock
    private ShopService shopService;

    @InjectMocks
    private ShopController shopController;

    private Item item1;
    private Item item2;
    private PurchaseRequest purchaseRequest;
    private ResPurchaseDto resPurchaseDto;
    private OffsetDateTime createdAt;

    @BeforeEach
    void initData() {
        item1 = new Item();
        item1.setId(1);
        item1.setName("Koi Food - Bethech");
        item1.setPrice(new BigDecimal("25"));
        item1.setItemType(ItemType.FOOD);

        item2 = new Item();
        item2.setId(2);
        item2.setName("Koi Fish - Kohaku");
        item2.setPrice(new BigDecimal("500"));
        item2.setItemType(ItemType.KOI);

        purchaseRequest = new PurchaseRequest();
        purchaseRequest.setUserId(1);
        purchaseRequest.setQuantity(2);

        createdAt = OffsetDateTime.of(2026, 8, 14, 21, 56, 42, 0, ZoneOffset.ofHours(7));

        ResTransactionDto resTransactionDto = new ResTransactionDto(
                1,
                1,
                "Koi Food - Bethech",
                new BigDecimal("50"),
                TransactionType.BUY_FOOD,
                TransactionStatus.SUCCESSED,
                "Bought 2 Koi Food - Bethech",
                createdAt
        );

        resPurchaseDto = new ResPurchaseDto(resTransactionDto, new BigDecimal("450"));
    }

    @Test
    void fetchItems_withoutCategory_success() {
        // GIVEN
        Page<Item> page = new PageImpl<>(List.of(item1, item2), PageRequest.of(0, 10), 2);
        when(shopService.getItems(null, 0, 10)).thenReturn(page);

        // WHEN
        ResponseEntity<Page<Item>> result = shopController.fetchItems(null, 0, 10);

        // THEN
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertEquals(2, result.getBody().getContent().size());
        verify(shopService).getItems(null, 0, 10);
    }

    @Test
    void fetchItems_withCategory_success() {
        // GIVEN
        Page<Item> page = new PageImpl<>(List.of(item1), PageRequest.of(0, 10), 1);
        when(shopService.getItems(ItemType.FOOD, 0, 10)).thenReturn(page);

        // WHEN
        ResponseEntity<Page<Item>> result = shopController.fetchItems(ItemType.FOOD, 0, 10);

        // THEN
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertEquals(1, result.getBody().getContent().size());
        assertEquals("Koi Food - Bethech", result.getBody().getContent().get(0).getName());
        verify(shopService).getItems(ItemType.FOOD, 0, 10);
    }

    @Test
    void fetchItems_emptyResult() {
        // GIVEN
        Page<Item> page = new PageImpl<>(List.of(), PageRequest.of(0, 10), 0);
        when(shopService.getItems(ItemType.KOI, 0, 10)).thenReturn(page);

        // WHEN
        ResponseEntity<Page<Item>> result = shopController.fetchItems(ItemType.KOI, 0, 10);

        // THEN
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertTrue(result.getBody().getContent().isEmpty());
    }

    @Test
    void purchaseShopItem_success() {
        // GIVEN
        when(shopService.purchaseShopItem(1, 1, 2)).thenReturn(resPurchaseDto);

        // WHEN
        ResponseEntity<ResPurchaseDto> result = shopController.purchaseShopItem(1, purchaseRequest);

        // THEN
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertEquals(resPurchaseDto, result.getBody());
        assertEquals(new BigDecimal("450"), result.getBody().getBalance());

        verify(shopService).purchaseShopItem(1, 1, 2);
    }

    @Test
    void purchaseShopItem_invalidQuantity() {
        // GIVEN
        purchaseRequest.setQuantity(0);
        when(shopService.purchaseShopItem(1, 1, 0))
                .thenThrow(new IllegalArgumentException("Quantity must be at least 1"));

        // WHEN + THEN
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> shopController.purchaseShopItem(1, purchaseRequest)
        );

        assertEquals("Quantity must be at least 1", exception.getMessage());
    }

    @Test
    void purchaseShopItem_currencyType_shouldPropagateException() {
        // GIVEN
        when(shopService.purchaseShopItem(1, 3, 2))
                .thenThrow(new IllegalArgumentException("Currency packages must be paid through the payment endpoint"));

        // WHEN + THEN
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> shopController.purchaseShopItem(3, purchaseRequest)
        );

        assertEquals("Currency packages must be paid through the payment endpoint", exception.getMessage());
    }
}