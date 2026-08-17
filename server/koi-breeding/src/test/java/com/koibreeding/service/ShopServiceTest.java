package com.koibreeding.service;

import com.koibreeding.domain.Item;
import com.koibreeding.domain.Transaction;
import com.koibreeding.domain.User;
import com.koibreeding.domain.Wallet;
import com.koibreeding.dto.response.ResPurchaseDto;
import com.koibreeding.dto.response.ResTransactionDto;
import com.koibreeding.enums.ItemType;
import com.koibreeding.enums.NotificationType;
import com.koibreeding.enums.TransactionStatus;
import com.koibreeding.enums.TransactionType;
import com.koibreeding.repository.ItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ShopServiceTest {

    @Mock
    private ItemRepository itemRepository;

    @Mock
    private ItemService itemService;

    @Mock
    private WalletService walletService;

    @Mock
    private InventoryService inventoryService;

    @Mock
    private TransactionService transactionService;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private ShopService shopService;

    private User user;
    private Wallet wallet;
    private Item foodItem;
    private Item koiItem;
    private Item currencyItem;
    private OffsetDateTime createdAt;

    @BeforeEach
    void initData() {
        user = new User();
        user.setId(1);

        wallet = new Wallet();
        wallet.setId(1);
        wallet.setUser(user);
        wallet.setBalance(new BigDecimal("450.0"));

        foodItem = new Item();
        foodItem.setId(1);
        foodItem.setName("Koi Food - Bethech");
        foodItem.setPrice(new BigDecimal("25.0"));
        foodItem.setItemType(ItemType.FOOD);

        koiItem = new Item();
        koiItem.setId(2);
        koiItem.setName("Koi Fish - Kohaku");
        koiItem.setPrice(new BigDecimal("500.0"));
        koiItem.setItemType(ItemType.KOI);

        currencyItem = new Item();
        currencyItem.setId(3);
        currencyItem.setName("100 Coins Package");
        currencyItem.setPrice(new BigDecimal("10.0"));
        currencyItem.setItemType(ItemType.CURRENCY);

        createdAt = OffsetDateTime.of(2026, 8, 14, 21, 56, 42, 0, ZoneOffset.ofHours(7));
    }

    @Test
    void getItems_withoutCategory_success() {
        // GIVEN
        Page<Item> page = new PageImpl<>(List.of(foodItem, koiItem), PageRequest.of(0, 10), 2);
        when(itemRepository.findAll(any(Pageable.class))).thenReturn(page);

        // WHEN
        Page<Item> result = shopService.getItems(null, 0, 10);

        // THEN
        assertEquals(2, result.getContent().size());
        verify(itemRepository).findAll(any(Pageable.class));
        verify(itemRepository, never()).findByItemType(any(), any());
    }

    @Test
    void getItems_withCategory_success() {
        // GIVEN
        Page<Item> page = new PageImpl<>(List.of(foodItem), PageRequest.of(0, 10), 1);
        when(itemRepository.findByItemType(eq(ItemType.FOOD), any(Pageable.class))).thenReturn(page);

        // WHEN
        Page<Item> result = shopService.getItems(ItemType.FOOD, 0, 10);

        // THEN
        assertEquals(1, result.getContent().size());
        assertEquals("Koi Food - Bethech", result.getContent().get(0).getName());
        verify(itemRepository).findByItemType(eq(ItemType.FOOD), any(Pageable.class));
        verify(itemRepository, never()).findAll(any(Pageable.class));
    }

    @Test
    void purchaseShopItem_foodItem_success() {
        // GIVEN
        BigDecimal total = new BigDecimal("50.0"); // 25.0 * 2

        when(itemService.findItemById(1)).thenReturn(foodItem);
        when(walletService.deduct(1, total)).thenReturn(wallet);

        Transaction savedTransaction = new Transaction();
        savedTransaction.setId(1);
        savedTransaction.setWallet(wallet);
        savedTransaction.setItem(foodItem);
        savedTransaction.setAmount(total);
        savedTransaction.setTransactionType(TransactionType.BUY_FOOD);
        savedTransaction.setStatus(TransactionStatus.SUCCESSED);
        savedTransaction.setDescription("Bought 2 Koi Food - Bethech");
        savedTransaction.setCreatedAt(createdAt);

        when(transactionService.handleCreateTransaction(any(Transaction.class)))
                .thenReturn(savedTransaction);

        ResTransactionDto transactionDto = new ResTransactionDto(
                1, 1, "Koi Food - Bethech", total, TransactionType.BUY_FOOD,
                TransactionStatus.SUCCESSED, "Bought 2 Koi Food - Bethech", createdAt
        );
        when(transactionService.toDto(savedTransaction)).thenReturn(transactionDto);

        // WHEN
        ResPurchaseDto result = shopService.purchaseShopItem(1, 1, 2);

        // THEN
        assertNotNull(result);
        assertEquals(transactionDto, result.getTransaction());
        assertEquals(new BigDecimal("450.0"), result.getBalance());

        verify(walletService).deduct(1, total);
        verify(inventoryService).addItemToInventory(1, 1, 2);
        verify(notificationService).createAndSend(
                eq(1), eq(NotificationType.PURCHASE_SUCCESS), eq("Purchase successful"), eq("Bought 2 Koi Food - Bethech"));
    }

    @Test
    void purchaseShopItem_koiItem_success() {
        // GIVEN
        BigDecimal total = new BigDecimal("500.0"); // 500.0 * 1

        when(itemService.findItemById(2)).thenReturn(koiItem);
        when(walletService.deduct(1, total)).thenReturn(wallet);

        Transaction savedTransaction = new Transaction();
        savedTransaction.setId(2);
        savedTransaction.setWallet(wallet);
        savedTransaction.setItem(koiItem);
        savedTransaction.setAmount(total);
        savedTransaction.setTransactionType(TransactionType.BUY_FISH);
        savedTransaction.setStatus(TransactionStatus.SUCCESSED);
        savedTransaction.setDescription("Bought 1 Koi Fish - Kohaku");
        savedTransaction.setCreatedAt(createdAt);

        when(transactionService.handleCreateTransaction(any(Transaction.class)))
                .thenReturn(savedTransaction);

        ResTransactionDto transactionDto = new ResTransactionDto(
                2, 2, "Koi Fish - Kohaku", total, TransactionType.BUY_FISH,
                TransactionStatus.SUCCESSED, "Bought 1 Koi Fish - Kohaku", createdAt
        );
        when(transactionService.toDto(savedTransaction)).thenReturn(transactionDto);

        // WHEN
        ResPurchaseDto result = shopService.purchaseShopItem(1, 2, 1);

        // THEN
        assertNotNull(result);
        assertEquals(TransactionType.BUY_FISH, result.getTransaction().getTransactionType());

        verify(walletService).deduct(1, total);
        verify(inventoryService).addItemToInventory(1, 2, 1);
    }

    @Test
    void purchaseShopItem_quantityNull_shouldThrowException() {
        // GIVEN
        when(itemService.findItemById(1)).thenReturn(foodItem);

        // WHEN + THEN
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> shopService.purchaseShopItem(1, 1, null)
        );

        assertEquals("Quantity must be at least 1", exception.getMessage());
        verifyNoInteractions(walletService, inventoryService, transactionService, notificationService);
    }

    @Test
    void purchaseShopItem_quantityLessThanOne_shouldThrowException() {
        // GIVEN
        when(itemService.findItemById(1)).thenReturn(foodItem);

        // WHEN + THEN
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> shopService.purchaseShopItem(1, 1, 0)
        );

        assertEquals("Quantity must be at least 1", exception.getMessage());
        verifyNoInteractions(walletService, inventoryService, transactionService, notificationService);
    }

    @Test
    void purchaseShopItem_currencyType_shouldThrowException() {
        // GIVEN
        when(itemService.findItemById(3)).thenReturn(currencyItem);

        // WHEN + THEN
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> shopService.purchaseShopItem(1, 3, 1)
        );

        assertEquals("Currency packages must be paid through the payment endpoint", exception.getMessage());
        verifyNoInteractions(walletService, inventoryService, transactionService, notificationService);
    }

    @Test
    void purchaseShopItem_insufficientBalance_shouldPropagateException() {
        // GIVEN
        BigDecimal total = new BigDecimal("50.0");
        when(itemService.findItemById(1)).thenReturn(foodItem);
        when(walletService.deduct(1, total)).thenThrow(new RuntimeException("Insufficient balance"));

        // WHEN + THEN
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> shopService.purchaseShopItem(1, 1, 2)
        );

        assertEquals("Insufficient balance", exception.getMessage());
        verifyNoInteractions(inventoryService, transactionService, notificationService);
    }
}