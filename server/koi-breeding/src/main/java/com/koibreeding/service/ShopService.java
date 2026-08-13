package com.koibreeding.service;

import com.koibreeding.domain.Inventory;
import com.koibreeding.domain.Item;
import com.koibreeding.domain.Transaction;
import com.koibreeding.domain.Wallet;
import com.koibreeding.enums.ItemType;
import com.koibreeding.enums.TransactionStatus;
import com.koibreeding.enums.TransactionType;
import com.koibreeding.repository.*;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ShopService {
        private final ItemRepository itemRepository;
        private final ItemService itemService;
        private final WalletService walletService;
        private final InventoryService inventoryService;
        private final TransactionService transactionService;
        public Page<Item> getItems(ItemType category, int page, int size) {
                Pageable pageable = PageRequest.of(page, size);

                Page<Item> items = category == null
                                ? itemRepository.findAll(pageable)
                                : itemRepository.findByItemType(category, pageable);

                return items;

        }

    public void purchaseShopItem(Integer userId, Integer itemId, Integer quantity){
        Item item = itemService.findItemById(itemId);
        BigDecimal total = item.getPrice().multiply(BigDecimal.valueOf(quantity));

        Wallet wallet= walletService.deduct(userId, total);
        inventoryService.addItemToInventory(userId, itemId, quantity);

        Transaction transaction = new Transaction();
        transaction.setWallet(wallet);
        transaction.setAmount(total);
        transaction.setTransactionType(
                switch (item.getItemType()){
                    case KOI -> TransactionType.BUY_FISH;
                    case FOOD -> TransactionType.BUY_FOOD;
                    case MEDICINE -> TransactionType.BUY_FOOD;
                    case CURRENCY -> TransactionType.DEPOSIT;
                }
        );
        transaction.setStatus(TransactionStatus.SUCCESSED);
        transaction.setDescription("Buy " + quantity + " " + item.getName());
        transactionService.handleCreateTransaction(transaction);
    }

}
