package com.koibreeding.seeder;

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
import com.koibreeding.domain.Item;
import com.koibreeding.domain.User;
import com.koibreeding.repository.InventoryRepository;
import com.koibreeding.repository.ItemRepository;
import com.koibreeding.repository.UserRepository;

@Component
@Order(8)
public class InventorySeeder implements CommandLineRunner {
    private InventoryRepository inventoryRepository;
    private ItemRepository itemRepository;
    private UserRepository userRepository;

    public InventorySeeder(InventoryRepository inventoryRepository, ItemRepository itemRepository,
            UserRepository userRepository) {
        this.inventoryRepository = inventoryRepository;
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (inventoryRepository.count() > 0) {
            System.out.println(">>> Inventories already exist");
            return;
        }

        List<String> defaultUsers = new ArrayList<>();
        for (int i = 1; i <= 5; ++i) {
            defaultUsers.add("admin" + i);
            defaultUsers.add("player" + i);
        }

        List<User> existingUserList = userRepository.findAll().stream()
                .filter(user -> defaultUsers.contains(user.getUsername())).collect(Collectors.toList());

        Map<String, Item> existingItemsByName = itemRepository.findAll().stream()
                .filter(Objects::nonNull)
                .filter(v -> v.getName() != null)
                .collect(Collectors.toMap(
                        v -> v.getName(),
                        item -> item,
                        (left, right) -> left,
                        LinkedHashMap::new));

        List<Inventory> seededInventories = List.of(
                inventory(existingItemsByName.get("Koi - Kohaku"), 1),
                inventory(existingItemsByName.get("Koi - Yamato Nishiki"), 2),
                inventory(existingItemsByName.get("Koi - Showa Sanshoku"), 3),
                inventory(existingItemsByName.get("Koi Food - Aqua Master"), 10),
                inventory(existingItemsByName.get("Koi Food - Bethech"), 5),
                inventory(existingItemsByName.get("Health Elixir - KAFKA"), 3),
                inventory(existingItemsByName.get("Environment Elixir - KMnO4"), 4));

        List<Inventory> inventoriesToSave = new ArrayList<>();

        for (User user : existingUserList) {
            for (Inventory template : seededInventories) {
                inventoriesToSave.add(cloneInventoryForUser(template, user));
            }
        }

        inventoryRepository.saveAll(inventoriesToSave);
        System.out.println(">>> Seeded Inventories Successfully");
    }

    public Inventory inventory(Item item, int quantity) {
        Inventory inventory = new Inventory();
        inventory.setItem(item);
        inventory.setQuantity(quantity);

        return inventory;
    }

    public Inventory cloneInventoryForUser(Inventory template, User user) {
        Inventory clonedInventory = new Inventory();
        clonedInventory.setUser(user);
        clonedInventory.setItem(template.getItem());
        clonedInventory.setQuantity(template.getQuantity());

        return clonedInventory;
    }

}
