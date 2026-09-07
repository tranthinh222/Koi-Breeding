package com.koibreeding.seeder;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import com.koibreeding.domain.Inventory;
import com.koibreeding.domain.Transaction;
import com.koibreeding.domain.User;
import com.koibreeding.domain.Wallet;
import com.koibreeding.enums.ItemType;
import com.koibreeding.enums.TransactionStatus;
import com.koibreeding.enums.TransactionType;
import com.koibreeding.repository.InventoryRepository;
import com.koibreeding.repository.TransactionRepository;
import com.koibreeding.repository.UserRepository;
import com.koibreeding.repository.WalletRepository;

@Component
@Order(9)
public class TransactionSeeder implements CommandLineRunner {
    private TransactionRepository transactionRepository;
    private InventoryRepository inventoryRepository;
    private UserRepository userRepository;
    private WalletRepository walletRepository;

    public TransactionSeeder(TransactionRepository transactionRepository, InventoryRepository inventoryRepository,
            UserRepository userRepository, WalletRepository walletRepository) {
        this.transactionRepository = transactionRepository;
        this.inventoryRepository = inventoryRepository;
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (transactionRepository.count() > 0) {
            System.out.println(">>> Transactions already exist");
            return;
        }

        List<String> defaultUsers = new ArrayList<>();
        for (int i = 1; i <= 5; ++i) {
            defaultUsers.add("admin" + i);
            defaultUsers.add("player" + i);
        }

        List<Inventory> inventories = inventoryRepository.findAll().stream()
                .filter(inventory -> defaultUsers.contains(inventory.getUser().getUsername()))
                .collect(Collectors.toList());
        List<User> existingUserList = userRepository.findAll().stream()
                .filter(user -> defaultUsers.contains(user.getUsername())).collect(Collectors.toList());

        Map<Integer, Wallet> existingWalletsByUser = walletRepository.findAll().stream()
                .filter(Objects::nonNull)
                .filter(v -> v.getUser() != null)
                .collect(Collectors.toMap(
                        v -> v.getUser().getId(),
                        item -> item,
                        (left, right) -> left,
                        LinkedHashMap::new));

        List<Transaction> transactionsToSave = new ArrayList<>();

        for (User user : existingUserList) {
            Wallet userWallet = existingWalletsByUser.get(user.getId());
            for (Inventory inventory : inventories) {
                transactionsToSave.add(transaction(inventory, userWallet, TransactionStatus.SUCCESSED,
                        "Buy x" + inventory.getQuantity() + " " + inventory.getItem().getName()));
            }
        }

        transactionRepository.saveAll(transactionsToSave);
        System.out.println(">>> Seeded Transactions Successfully");
    }

    public Transaction transaction(Inventory inventory, Wallet wallet,
            TransactionStatus transactionStatus, String description) {
        Transaction transaction = new Transaction();
        transaction.setItem(inventory.getItem());
        transaction.setWallet(wallet);
        BigDecimal amount = inventory.getItem().getPrice().multiply(BigDecimal.valueOf(inventory.getQuantity()));
        transaction.setAmount(amount);
        TransactionType transactionType = TransactionType.BUY_FOOD;

        if (inventory.getItem().getItemType().equals(ItemType.KOI)) {
            transactionType = TransactionType.BUY_FISH;
        } else if (inventory.getItem().getItemType().equals(ItemType.CURRENCY)) {
            transactionType = TransactionType.DEPOSIT;
        }

        transaction.setTransactionType(transactionType);
        transaction.setStatus(transactionStatus);
        transaction.setDescription(description);

        return transaction;
    }

}
