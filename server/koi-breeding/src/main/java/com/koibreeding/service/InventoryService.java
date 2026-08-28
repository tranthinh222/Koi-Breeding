package com.koibreeding.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.koibreeding.domain.Inventory;
import com.koibreeding.domain.Item;
import com.koibreeding.domain.User;
import com.koibreeding.dto.response.ResItemInventory;
import com.koibreeding.dto.response.ResItemInventoryDTO;
import com.koibreeding.enums.ItemType;
import com.koibreeding.repository.InventoryRepository;

import lombok.RequiredArgsConstructor;
import lombok.val;

@Service
@RequiredArgsConstructor
public class InventoryService {
    private final InventoryRepository inventoryRepository;
    private final UserService userService;
    private final ItemService itemService;

    public List<ResItemInventory> getInventory(Integer userId) {
        val inventory = inventoryRepository.findByUserId(userId);
        if (inventory == null) {
            throw new RuntimeException("not found inventory");
        }
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
        if (user == null) {
            throw new RuntimeException("not found user");
        }

        Item item = itemService.findItemById(itemId);
        if (item == null) {
            throw new RuntimeException("not found item");
        }
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
                    inventory.getItem().getItemType(), inventory.getItem().getEffectValue(),
                    inventory.getItem().getEffectType(),
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

    public Inventory handleFetchInventoryById(Integer inventoryId) {
        return this.inventoryRepository.findById(inventoryId).orElse(null);
    }

    public List<ResItemInventoryDTO> handleFetchUserInventoryByItemType(Integer userId, ItemType itemType) {
        if (!userService.isUserExistById(userId)) {
            throw new RuntimeException("Failed to fetch user inventory. User does not exist.");
        }

        List<ResItemInventoryDTO> inventoryList = this.inventoryRepository
                .findByUser_IdAndItem_ItemType(userId, itemType)
                .stream().map(this::convertToResItemInventoryDTO).collect(Collectors.toList());

        return inventoryList;
    }

    public ResItemInventory convertToResItemInventory(Inventory inventory) {
        return new ResItemInventory(
                inventory.getItem().getId(),
                inventory.getItem().getName(),
                inventory.getItem().getPrice(),
                inventory.getItem().getItemType(),
                inventory.getItem().getEffectValue(),
                inventory.getItem().getEffectType(),
                inventory.getItem().getDescription(),
                inventory.getQuantity(),
                inventory.getItem().getItemUrl());
    }

    public ResItemInventoryDTO convertToResItemInventoryDTO(Inventory inventory) {
        return new ResItemInventoryDTO(
                inventory.getId(),
                inventory.getItem().getId(),
                inventory.getItem().getName(),
                inventory.getItem().getPrice(),
                inventory.getItem().getItemType(),
                inventory.getItem().getEffectValue(),
                inventory.getItem().getEffectType(),
                inventory.getItem().getDescription(),
                inventory.getQuantity(),
                inventory.getItem().getItemUrl());
    }
}
