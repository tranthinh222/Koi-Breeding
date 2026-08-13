package com.koibreeding.service;

import com.koibreeding.domain.Inventory;
import com.koibreeding.domain.Item;
import com.koibreeding.domain.Transaction;
import com.koibreeding.domain.Wallet;
import com.koibreeding.dto.response.ResPurchaseDto;
import com.koibreeding.enums.ItemType;
import com.koibreeding.enums.NotificationType;
import com.koibreeding.enums.TransactionStatus;
import com.koibreeding.enums.TransactionType;
import com.koibreeding.repository.*;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ShopService {
        private final ItemRepository itemRepository;
        private final ItemService itemService;
        private final WalletService walletService;
        private final InventoryService inventoryService;
        private final TransactionService transactionService;
        private final NotificationService notificationService;
        public Page<Item> getItems(ItemType category, int page, int size) {
                Pageable pageable = PageRequest.of(page, size);

                Page<Item> items = category == null
                                ? itemRepository.findAll(pageable)
                                : itemRepository.findByItemType(category, pageable);

                return items;

        }

    @Transactional
    public ResPurchaseDto purchaseShopItem(Integer userId, Integer itemId, Integer quantity){
        Item item = itemService.findItemById(itemId);
        if (quantity == null || quantity < 1) {
            throw new IllegalArgumentException("Quantity must be at least 1");
        }
        BigDecimal total = item.getPrice().multiply(BigDecimal.valueOf(quantity));
        Wallet wallet;
        TransactionType transactionType;
        String description;

        if (item.getItemType() == ItemType.CURRENCY) {
            BigDecimal koins = item.getEffectValue().multiply(BigDecimal.valueOf(quantity));
            wallet = walletService.credit(userId, koins);
            transactionType = TransactionType.DEPOSIT;
            description = "Added " + koins + " Koins from " + item.getName();
        } else {
            wallet = walletService.deduct(userId, total);
            inventoryService.addItemToInventory(userId, itemId, quantity);
            transactionType = item.getItemType() == ItemType.KOI ? TransactionType.BUY_FISH : TransactionType.BUY_FOOD;
            description = "Bought " + quantity + " " + item.getName();
        }

        Transaction transaction = new Transaction();
        transaction.setWallet(wallet);
        transaction.setItem(item);
        transaction.setAmount(total);
        transaction.setTransactionType(transactionType);
        transaction.setStatus(TransactionStatus.SUCCESSED);
        transaction.setDescription(description);
        Transaction savedTransaction = transactionService.handleCreateTransaction(transaction);
        notificationService.createAndSend(userId, NotificationType.PURCHASE_SUCCESS, "Purchase successful", description);
        return new ResPurchaseDto(transactionService.toDto(savedTransaction), wallet.getBalance());
    }

}
