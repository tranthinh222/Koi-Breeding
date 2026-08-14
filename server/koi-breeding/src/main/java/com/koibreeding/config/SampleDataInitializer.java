package com.koibreeding.config;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.koibreeding.domain.Inventory;
import com.koibreeding.domain.Item;
import com.koibreeding.domain.Notification;
import com.koibreeding.domain.Transaction;
import com.koibreeding.domain.User;
import com.koibreeding.domain.Wallet;
import com.koibreeding.enums.EffectType;
import com.koibreeding.enums.Gender;
import com.koibreeding.enums.ItemType;
import com.koibreeding.enums.NotificationType;
import com.koibreeding.enums.Role;
import com.koibreeding.enums.TransactionStatus;
import com.koibreeding.enums.TransactionType;
import com.koibreeding.enums.UserStatus;
import com.koibreeding.repository.InventoryRepository;
import com.koibreeding.repository.ItemRepository;
import com.koibreeding.repository.NotificationRepository;
import com.koibreeding.repository.TransactionRepository;
import com.koibreeding.repository.UserRepository;
import com.koibreeding.repository.WalletRepository;

@Configuration
public class SampleDataInitializer {

    @Bean
    CommandLineRunner seedSampleData(ItemRepository itemRepository, UserRepository userRepository,
            WalletRepository walletRepository, InventoryRepository inventoryRepository,
            TransactionRepository transactionRepository, NotificationRepository notificationRepository) {
        return args -> {
            Map<String, Item> existingItemsByName = itemRepository.findAll().stream()
                    .collect(Collectors.toMap(Item::getName, item -> item, (left, right) -> left, LinkedHashMap::new));

            List<Item> seededItems = List.of(
                    item("Koi Food - Aqua Master", "15.00", ItemType.FOOD, EffectType.GROWTH, "15.00",
                            "Common food that restores 15 food points.",
                            "https://res.cloudinary.com/djmcluh5n/image/upload/v1786628411/uploads/items/vdgmp3zgrcwy6qfaduv5.svg"),
                    item("Koi Food - Bethech", "25.00", ItemType.FOOD, EffectType.GROWTH, "30.00",
                            "Standard food that restores 30 food points.", 
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1786628498/uploads/items/jbpkxycegrmrtiywi0tq.svg"),
                    item("Koi Food - Ipick", "45.00", ItemType.FOOD, EffectType.GROWTH, "50.00",
                            "Premium food that restores 50 food points.",
                            "https://res.cloudinary.com/djmcluh5n/image/upload/v1786628532/uploads/items/fnn7slmun7ktkkttifes.svg"),
                    item("Koi Food - Kofu", "75.00", ItemType.FOOD, EffectType.GROWTH, "90.00",
                            "Legendary food that restores 90 food points.",
                            "https://res.cloudinary.com/djmcluh5n/image/upload/v1786628571/uploads/items/wtvx5qvpkwxcnsaj6guw.svg"),
                    item("Koi Food - Koi King", "35.00", ItemType.FOOD, EffectType.GROWTH, "40.00",
                            "A balanced daily food for healthy Koi.",
                            "https://res.cloudinary.com/djmcluh5n/image/upload/v1786628891/uploads/items/pvsyus6qwcebvhpaxd0j.svg"),

                    item("Environment Elixir - KMnO4", "15.00", ItemType.MEDICINE, EffectType.WATER_QUALITY, "15.00",
                            "Restores 15 water-quality points and helps disinfect the pond.",
                            "https://res.cloudinary.com/djmcluh5n/image/upload/v1786628948/uploads/items/b6s6nqu3phlh79obevyc.svg"),
                    item("Environment Elixir - ORARPS", "25.00", ItemType.MEDICINE, EffectType.WATER_QUALITY, "30.00",
                            "Standard treatment for pond water quality.",
                            "https://res.cloudinary.com/djmcluh5n/image/upload/v1786629001/uploads/items/esai3zntpelx0d2jdv7d.svg"),
                    item("Environment Elixir - DIMILIN", "45.00", ItemType.MEDICINE, EffectType.WATER_QUALITY, "50.00",
                            "Premium water-quality treatment for a clean pond.",
                            "https://res.cloudinary.com/djmcluh5n/image/upload/v1786629031/uploads/items/nssd84q3glrt5mkz82nj.svg"),
                    item("Disease Cure - Link", "15.00", ItemType.MEDICINE, EffectType.WATER_QUALITY, "10.00",
                            "Common medicine used to treat minor Koi diseases.",
                            "https://res.cloudinary.com/djmcluh5n/image/upload/v1786629083/uploads/items/ycpzocraxl4gmgordzvu.svg"),
                    item("Disease Cure - MIP", "25.00", ItemType.MEDICINE, EffectType.WATER_QUALITY, "25.00",
                            "Standard medicine for treating common diseases.",
                            "https://res.cloudinary.com/djmcluh5n/image/upload/v1786629116/uploads/items/to9axfaid3gm2y4brqxv.svg"),
                    item("Disease Cure - Cloak", "45.00", ItemType.MEDICINE, EffectType.WATER_QUALITY, "45.00",
                            "Premium cure for severe Koi diseases.",
                            "https://res.cloudinary.com/djmcluh5n/image/upload/v1786629140/uploads/items/qxryphcvy1acd8fijyfv.svg"),
                    item("Mutation Elixir - CLAK", "15.00", ItemType.MEDICINE, EffectType.MUTATION, "5.00",
                            "Common elixir with a small mutation bonus.", 
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1786629184/uploads/items/hbuwdasojzkzc4lq2lpu.svg"),
                    item("Health Elixir - KAFKA", "45.00", ItemType.MEDICINE, EffectType.GROWTH, "40.00",
                            "Premium health elixir that improves Koi recovery.",
                            "https://res.cloudinary.com/djmcluh5n/image/upload/v1786629220/uploads/items/q1octogpibw1pksh2yez.svg"),

                    item("Koi - Kohaku", "100.00", ItemType.KOI, EffectType.GROWTH, "1.00",
                            "Classic white Koi with vivid red Hi markings.",
                            "https://res.cloudinary.com/djmcluh5n/image/upload/v1786629266/uploads/items/cxnccf0exmmyaf0ddf5e.svg"),
                    item("Koi - Tancho", "180.00", ItemType.KOI, EffectType.GROWTH, "1.00",
                            "Distinctive Koi with a signature red marking on its head.",
                            "https://res.cloudinary.com/djmcluh5n/image/upload/v1786629292/uploads/items/jzckhsxukfrdilmrsjrq.svg"),
                    item("Koi - Taisho Sanke", "120.00", ItemType.KOI, EffectType.GROWTH, "1.00",
                            "A graceful Koi with white, red, and black patterns.",
                            "https://res.cloudinary.com/djmcluh5n/image/upload/v1786629315/uploads/items/gi7oeh6f4h5fphewfano.svg"),

                    item("Koins Pack - 250", "25000", ItemType.CURRENCY, null, "250",
                            "Receive 250 Koins after successful payment.",
                            "https://res.cloudinary.com/djmcluh5n/image/upload/v1786618553/uploads/items/d27v3vwzkdp1bj2cpllt.svg"),
                    item("Koins Pack - 750", "75000", ItemType.CURRENCY, null, "750",
                            "Receive 750 Koins after successful payment.",
                            "https://res.cloudinary.com/djmcluh5n/image/upload/v1786621657/uploads/items/i2ixkywqfkon8d9dwqvg.svg"),
                    item("Koins Pack - 3000", "300000", ItemType.CURRENCY, null, "3000",
                            "Receive 3,000 Koins after successful payment.",
                            "https://res.cloudinary.com/djmcluh5n/image/upload/v1786629378/uploads/items/f5y9pbvqldhcixknvysf.svg"),
                    item("Koins Pack - 9000", "850000", ItemType.CURRENCY, null, "9000",
                            "Receive 9,000 Koins after successful payment.",
                            "https://res.cloudinary.com/djmcluh5n/image/upload/v1786629408/uploads/items/u5u9yoemfldk9ppndwbv.svg"),
                    item("Koins Pack - 25000", "2200000", ItemType.CURRENCY, null, "25000",
                            "Receive 25,000 Koins after successful payment.",
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1786629525/uploads/items/xhaaz1lvc5jqmolrqo4t.svg"));
            itemRepository.saveAll(seededItems.stream()
                    .map(seededItem -> {
                        Item existingItem = existingItemsByName.get(seededItem.getName());
                        if (existingItem == null) {
                            return seededItem;
                        }

                        existingItem.setPrice(seededItem.getPrice());
                        existingItem.setItemType(seededItem.getItemType());
                        existingItem.setEffectType(seededItem.getEffectType());
                        existingItem.setEffectValue(seededItem.getEffectValue());
                        existingItem.setUsageLimit(seededItem.getUsageLimit());
                        existingItem.setDescription(seededItem.getDescription());
                        existingItem.setItemUrl(seededItem.getItemUrl());
                        return existingItem;
                    })
                    .toList());

            Map<String, Item> itemsByName = itemRepository.findAll().stream()
                    .collect(Collectors.toMap(Item::getName, item -> item, (left, right) -> left, LinkedHashMap::new));

            User demoUser = userRepository.findAll().stream()
                    .filter(user -> "demo_user".equals(user.getUsername()))
                    .findFirst()
                    .orElseGet(User::new);
            demoUser.setUsername("demo_user");
            demoUser.setEmail("demo_user@koi.local");
            demoUser.setPassword("123456");
            demoUser.setBirthday(LocalDate.of(2000, 1, 1));
            demoUser.setGender(Gender.MALE);
            demoUser.setStatus(UserStatus.ACTIVE);
            demoUser.setRole(Role.USER);
            demoUser.setIsBanned(false);
            demoUser.setExp(0);
            demoUser.setAvatarUrl(null);
            demoUser = userRepository.save(demoUser);

            Wallet wallet = walletRepository.findByUserId(demoUser.getId()).orElseGet(Wallet::new);
            wallet.setUser(demoUser);
            wallet.setBalance(new BigDecimal("1000"));
            walletRepository.save(wallet);

            User sampleUser = userRepository.findAll().stream()
                    .filter(user -> "koi_enthusiast".equals(user.getUsername()))
                    .findFirst()
                    .orElseGet(User::new);
            sampleUser.setUsername("koi_enthusiast");
            sampleUser.setEmail("koi_enthusiast@koi.local");
            sampleUser.setPassword("123456");
            sampleUser.setBirthday(LocalDate.of(1998, 6, 15));
            sampleUser.setGender(Gender.FEMALE);
            sampleUser.setStatus(UserStatus.ACTIVE);
            sampleUser.setRole(Role.USER);
            sampleUser.setIsBanned(false);
            sampleUser.setExp(250);
            sampleUser.setAvatarUrl(null);
            sampleUser = userRepository.save(sampleUser);

            Wallet sampleWallet = walletRepository.findByUserId(sampleUser.getId()).orElseGet(Wallet::new);
            sampleWallet.setUser(sampleUser);
            sampleWallet.setBalance(new BigDecimal("5000"));
            walletRepository.save(sampleWallet);

            seedInventoryRow(inventoryRepository, demoUser, itemsByName.get("Koi - Kohaku"), 1);
            seedInventoryRow(inventoryRepository, demoUser, itemsByName.get("Koi - Tancho"), 2);
            seedInventoryRow(inventoryRepository, demoUser, itemsByName.get("Koi - Taisho Sanke"), 1);
            seedInventoryRow(inventoryRepository, demoUser, itemsByName.get("Koi Food - Aqua Master"), 10);
            seedInventoryRow(inventoryRepository, demoUser, itemsByName.get("Koi Food - Bethech"), 5);
            seedInventoryRow(inventoryRepository, demoUser, itemsByName.get("Health Elixir - KAFKA"), 3);
            seedInventoryRow(inventoryRepository, demoUser, itemsByName.get("Environment Elixir - KMnO4"), 4);

            backfillTransactionsWithoutItem(transactionRepository, itemsByName.get("Koi Food - Aqua Master"));
            seedTransactions(transactionRepository, wallet, itemsByName);
            seedNotifications(notificationRepository, demoUser);
        };
    }

    private Item item(String name, String price, ItemType itemType, EffectType effectType, String effectValue,
            String description, String itemURL) {
        Item item = new Item();
        item.setName(name);
        item.setPrice(new BigDecimal(price));
        item.setItemType(itemType);
        item.setEffectType(effectType);
        item.setEffectValue(new BigDecimal(effectValue));
        item.setUsageLimit(1);
        item.setDescription(description);
        item.setItemUrl(itemURL);
        return item;
    }

    private void seedInventoryRow(InventoryRepository inventoryRepository, User user, Item item, int quantity) {
        if (item == null) {
            return;
        }

        Inventory inventory = inventoryRepository.findByUserIdAndItemId(user.getId(), item.getId())
                .orElseGet(Inventory::new);
        inventory.setUser(user);
        inventory.setItem(item);
        inventory.setQuantity(quantity);
        inventoryRepository.save(inventory);
    }

    private void backfillTransactionsWithoutItem(TransactionRepository transactionRepository, Item fallbackItem) {
        if (fallbackItem == null) {
            return;
        }
        List<Transaction> orphanTransactions = transactionRepository.findByItemIsNull();
        orphanTransactions.forEach(transaction -> transaction.setItem(fallbackItem));
        transactionRepository.saveAll(orphanTransactions);
    }

    private void seedTransactions(TransactionRepository transactionRepository, Wallet wallet, Map<String, Item> itemsByName) {
        if (!transactionRepository.findByWalletUserIdOrderByCreatedAtDesc(wallet.getUser().getId()).isEmpty()) {
            return;
        }

        seedTransaction(transactionRepository, wallet, itemsByName.get("Koi - Kohaku"), "100",
                TransactionType.BUY_FISH, "Bought 1 Koi - Kohaku");
        seedTransaction(transactionRepository, wallet, itemsByName.get("Koi Food - Aqua Master"), "30",
                TransactionType.BUY_FOOD, "Bought 2 Koi Food - Aqua Master");
        seedTransaction(transactionRepository, wallet, itemsByName.get("Koins Pack - 750"), "750",
                TransactionType.DEPOSIT, "Added 750 Koins from Koins Pack - 750");
    }

    private void seedTransaction(TransactionRepository transactionRepository, Wallet wallet, Item item, String amount,
            TransactionType type, String description) {
        if (item == null) {
            return;
        }
        Transaction transaction = new Transaction();
        transaction.setWallet(wallet);
        transaction.setItem(item);
        transaction.setAmount(new BigDecimal(amount));
        transaction.setTransactionType(type);
        transaction.setStatus(TransactionStatus.SUCCESSED);
        transaction.setDescription(description);
        transactionRepository.save(transaction);
    }

    private void seedNotifications(NotificationRepository notificationRepository, User user) {
        if (!notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).isEmpty()) {
            return;
        }
        seedNotification(notificationRepository, user, NotificationType.PURCHASE_SUCCESS, "Purchase successful",
                "Bought 1 Koi - Kohaku.");
        seedNotification(notificationRepository, user, NotificationType.DEPOSIT_SUCCESS, "Koins added",
                "750 Koins were added to your wallet.");
    }

    private void seedNotification(NotificationRepository notificationRepository, User user, NotificationType type,
            String title, String message) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notificationRepository.save(notification);
    }
}
