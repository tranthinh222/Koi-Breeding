package com.koibreeding.service;

import com.koibreeding.domain.Inventory;
import com.koibreeding.domain.Item;
import com.koibreeding.domain.Transaction;
import com.koibreeding.domain.Wallet;
import com.koibreeding.enums.TransactionStatus;
import com.koibreeding.enums.TransactionType;
import com.koibreeding.repository.InventoryRepository;
import com.koibreeding.repository.ItemRepository;
import com.koibreeding.repository.TransactionRepository;
import com.koibreeding.repository.WalletRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

@Service
public class ShopService {
    private final ItemRepository itemRepository;
    private final ItemService itemService;
    private final WalletService walletService;
    private final InventoryService inventoryService;
    private final TransactionService transactionService;
    public ShopService(ItemRepository itemRepository,
                       ItemService itemService,
                       WalletService walletService,
                       InventoryService inventoryService,
                       TransactionService transactionService
                       ){
        this.itemRepository = itemRepository;
        this.itemService = itemService;
        this.walletService = walletService;
        this.inventoryService = inventoryService;
        this.transactionService = transactionService;
    }

    public List<Item> listItem() {
        return itemRepository.findAll();
    }

    public void buyItem(Integer userId, Integer itemId, Integer quantity){
        Item item = itemService.handleFetchItem(itemId);
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
        transaction.setDescription("Buy " + quantity + " " +item.getName());
        transactionService.handleCreateTransaction(transaction);
    }

}
