package com.koibreeding.service;

import com.koibreeding.domain.Inventory;
import com.koibreeding.domain.Item;
import com.koibreeding.domain.User;
import com.koibreeding.dto.response.ResItemInventory;
import com.koibreeding.repository.InventoryRepository;
import com.koibreeding.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.val;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {
    private final InventoryRepository inventoryRepository;
    private final UserService userService;
    private final ItemService itemService;

    public List<ResItemInventory> getInventory(Integer userId) {
        val inventory = inventoryRepository.findByUserId(userId);
        return inventory.stream()
                .map(item -> new ResItemInventory(
                        item.getItem().getId(),
                        item.getItem().getName(),
                        item.getItem().getPrice(),
                        item.getItem().getItemType(),
                        item.getItem().getEffectValue(),
                        item.getItem().getEffectType(),
                        item.getItem().getDescription(),
                        item.getQuantity(),
                        item.getItem().getItemUrl()))
                .toList();
    }

    public Inventory handleCreateInventory(Inventory inventory) {
        return inventoryRepository.save(inventory);
    }

    public ResItemInventory addItemToInventory(Integer userId, Integer itemId, Integer quantity) {
        Inventory inventory = inventoryRepository.findByUserIdAndItemId(userId, itemId).orElse(null);
        User user = userService.handleFetchUserById(userId);
        Item item = itemService.findItemById(itemId);
        if (inventory == null) {
            inventory = new Inventory();
            inventory.setUser(user);
            inventory.setItem(item);
            inventory.setQuantity(quantity);

        } else {
            inventory.setQuantity(inventory.getQuantity() + quantity);
        }

        Inventory inventoryNew = handleCreateInventory(inventory);
        return new ResItemInventory(
                inventoryNew.getItem().getId(),
                inventoryNew.getItem().getName(),
                inventoryNew.getItem().getPrice(),
                inventoryNew.getItem().getItemType(),
                inventoryNew.getItem().getEffectValue(),
                inventoryNew.getItem().getEffectType(),
                inventoryNew.getItem().getDescription(),
                inventoryNew.getQuantity(),
                inventoryNew.getItem().getItemUrl());

    }

    public ResItemInventory useItemFromInventory(Integer userId, Integer itemId, Integer quantity) {
        if (quantity == null || quantity < 1) {
            throw new IllegalArgumentException("Quantity must be at least 1");
        }
        Inventory inventory = inventoryRepository.findByUserIdAndItemId(userId, itemId)
                .orElse(null);
        if (inventory == null) {
            throw new RuntimeException("not found item");
        }
        int quantityNew = inventory.getQuantity() - quantity;
        if (quantityNew < 0) {
            throw new RuntimeException("Insufficient item quantity");
        }
        if (quantityNew == 0) {
            inventoryRepository.delete(inventory);
            return new ResItemInventory(
                    inventory.getItem().getId(), inventory.getItem().getName(), inventory.getItem().getPrice(),
                    inventory.getItem().getItemType(), inventory.getItem().getEffectValue(), inventory.getItem().getEffectType(),
                    inventory.getItem().getDescription(), 0, inventory.getItem().getItemUrl());
        }
        inventory.setQuantity(quantityNew);

        Inventory inventoryNew = handleCreateInventory(inventory);
        return new ResItemInventory(
                inventoryNew.getItem().getId(),
                inventoryNew.getItem().getName(),
                inventoryNew.getItem().getPrice(),
                inventoryNew.getItem().getItemType(),
                inventoryNew.getItem().getEffectValue(),
                inventoryNew.getItem().getEffectType(),
                inventoryNew.getItem().getDescription(),
                inventoryNew.getQuantity(),
                inventoryNew.getItem().getItemUrl());
    }
}
