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
import com.koibreeding.domain.User;
import com.koibreeding.domain.Wallet;
import com.koibreeding.enums.EffectType;
import com.koibreeding.enums.Gender;
import com.koibreeding.enums.ItemType;
import com.koibreeding.enums.Role;
import com.koibreeding.enums.UserStatus;
import com.koibreeding.repository.InventoryRepository;
import com.koibreeding.repository.ItemRepository;
import com.koibreeding.repository.UserRepository;
import com.koibreeding.repository.WalletRepository;

@Configuration
public class SampleDataInitializer {

    @Bean
    CommandLineRunner seedSampleData(ItemRepository itemRepository, UserRepository userRepository,
            WalletRepository walletRepository, InventoryRepository inventoryRepository) {
        return args -> {
            Map<String, Item> existingItemsByName = itemRepository.findAll().stream()
                    .collect(Collectors.toMap(Item::getName, item -> item, (left, right) -> left, LinkedHashMap::new));

            List<Item> seededItems = List.of(
                    item("Koi Food - Aqua Master", "15.00", ItemType.FOOD, EffectType.GROWTH, "15.00",
                            "Common food that restores 15 food points.", null),
                    item("Koi Food - Bethech", "25.00", ItemType.FOOD, EffectType.GROWTH, "30.00",
                            "Standard food that restores 30 food points.", null),
                    item("Koi Food - Ipick", "45.00", ItemType.FOOD, EffectType.GROWTH, "50.00",
                            "Premium food that restores 50 food points.", null),
                    item("Koi Food - Kofu", "75.00", ItemType.FOOD, EffectType.GROWTH, "90.00",
                            "Legendary food that restores 90 food points.", null),
                    item("Koi Food - Sakura Blend", "35.00", ItemType.FOOD, EffectType.GROWTH, "40.00",
                            "A balanced daily food for healthy Koi.", null),

                    item("Environment Elixir - KMnO4", "15.00", ItemType.MEDICINE, EffectType.WATER_QUALITY, "15.00",
                            "Restores 15 water-quality points and helps disinfect the pond.", null),
                    item("Environment Elixir - ORARPS", "25.00", ItemType.MEDICINE, EffectType.WATER_QUALITY, "30.00",
                            "Standard treatment for pond water quality.", null),
                    item("Environment Elixir - DIMILIN", "45.00", ItemType.MEDICINE, EffectType.WATER_QUALITY, "50.00",
                            "Premium water-quality treatment for a clean pond.", null),
                    item("Disease Cure - Link", "15.00", ItemType.MEDICINE, EffectType.WATER_QUALITY, "10.00",
                            "Common medicine used to treat minor Koi diseases.", null),
                    item("Disease Cure - MIP", "25.00", ItemType.MEDICINE, EffectType.WATER_QUALITY, "25.00",
                            "Standard medicine for treating common diseases.", null),
                    item("Disease Cure - Cloak", "45.00", ItemType.MEDICINE, EffectType.WATER_QUALITY, "45.00",
                            "Premium cure for severe Koi diseases.", null),
                    item("Mutation Elixir - CLAK", "15.00", ItemType.MEDICINE, EffectType.MUTATION, "5.00",
                            "Common elixir with a small mutation bonus.", null),
                    item("Health Elixir - KAFKA", "45.00", ItemType.MEDICINE, EffectType.GROWTH, "40.00",
                            "Premium health elixir that improves Koi recovery.", null),

                    item("Koi - Kohaku", "100.00", ItemType.KOI, EffectType.GROWTH, "1.00",
                            "Classic white Koi with vivid red Hi markings.", null),
                    item("Koi - Tancho", "180.00", ItemType.KOI, EffectType.GROWTH, "1.00",
                            "Distinctive Koi with a signature red marking on its head.", null),
                    item("Koi - Taisho Sanke", "120.00", ItemType.KOI, EffectType.GROWTH, "1.00",
                            "A graceful Koi with white, red, and black patterns.", null),

                    item("Koins Pack - 250", "0.99", ItemType.CURRENCY, null, "250.00",
                            "Receive 250 Koins after successful payment.",
                            "https://res.cloudinary.com/djmcluh5n/image/upload/v1786618553/uploads/items/d27v3vwzkdp1bj2cpllt.svg"),
                    item("Koins Pack - 750", "2.99", ItemType.CURRENCY, null, "750.00",
                            "Receive 750 Koins after successful payment.",
                            "https://res.cloudinary.com/djmcluh5n/image/upload/v1786621657/uploads/items/i2ixkywqfkon8d9dwqvg.svg"),
                    item("Koins Pack - 3000", "4.99", ItemType.CURRENCY, null, "3000.00",
                            "Receive 3,000 Koins after successful payment.", null),
                    item("Koins Pack - 9000", "9.99", ItemType.CURRENCY, null, "9000.00",
                            "Receive 9,000 Koins after successful payment.", null));

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
            wallet.setBalance(new BigDecimal("1000.00"));
            walletRepository.save(wallet);

            seedInventoryRow(inventoryRepository, demoUser, itemsByName.get("Koi - Kohaku"), 1);
            seedInventoryRow(inventoryRepository, demoUser, itemsByName.get("Koi - Showa Sanshoku"), 2);
            seedInventoryRow(inventoryRepository, demoUser, itemsByName.get("Koi - Asagi"), 1);
            seedInventoryRow(inventoryRepository, demoUser, itemsByName.get("Koi - Ogon"), 3);
            seedInventoryRow(inventoryRepository, demoUser, itemsByName.get("Koi Food - Aqua Master"), 10);
            seedInventoryRow(inventoryRepository, demoUser, itemsByName.get("Koi Food - Bethech"), 5);
            seedInventoryRow(inventoryRepository, demoUser, itemsByName.get("Health Elixir - KAFKA"), 3);
            seedInventoryRow(inventoryRepository, demoUser, itemsByName.get("Environment Elixir - KMnO4"), 4);
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
}
