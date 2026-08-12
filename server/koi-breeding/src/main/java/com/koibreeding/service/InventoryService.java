package com.koibreeding.service;

import com.koibreeding.domain.Inventory;
import com.koibreeding.domain.Item;
import com.koibreeding.domain.User;
import com.koibreeding.dto.response.ItemInventory;
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
        public List<ItemInventory> getInventory(Integer userId) {
                val inventory = inventoryRepository.findByUserId(userId);
                return inventory.stream()
                                .map(item -> new ItemInventory(
                                                item.getItem().getId(),
                                                item.getItem().getName(),
                                                item.getItem().getPrice(),
                                                item.getItem().getItemType(),
                                                item.getItem().getEffectType(),
                                                item.getItem().getDescription(),
                                                item.getQuantity()))
                                .toList();
        }

    public Inventory handleCreateInventory(Inventory inventory){
            return inventoryRepository.save(inventory);
    }

    public ItemInventory addItemToInventory(Integer userId, Integer itemId, Integer quantity){
        Inventory inventory = inventoryRepository.findByUserIdAndItemId(userId, itemId).orElse(null);
        User user = userService.handleFetchUser(userId);
        Item item = itemService.findItemById(itemId);
        if(inventory == null){
            inventory = new Inventory();
            inventory.setUser(user);
            inventory.setItem(item);
            inventory.setQuantity(quantity);

        }else {
            inventory.setQuantity(inventory.getQuantity()+quantity);
        }

        Inventory inventoryNew = handleCreateInventory(inventory);
        return new ItemInventory(
                inventoryNew.getItem().getId(),
                inventoryNew.getItem().getName(),
                inventoryNew.getItem().getPrice(),
                inventoryNew.getItem().getItemType(),
                inventoryNew.getItem().getEffectType(),
                inventoryNew.getItem().getDescription(),
                inventoryNew.getQuantity()
        );

    }

    public ItemInventory useItemFromInventory(Integer userId, Integer itemId, Integer quantity){
        Inventory inventory = inventoryRepository.findByUserIdAndItemId(userId, itemId)
                .orElse(null);
        if(inventory == null){
            throw new RuntimeException("not found item");
        }
        int quantityNew = inventory.getQuantity() - quantity;
        if(quantityNew == 0){
            inventoryRepository.delete(inventory);
        }
        inventory.setQuantity(quantityNew);

        Inventory inventoryNew = handleCreateInventory(inventory);
        return  new ItemInventory(
                inventoryNew.getItem().getId(),
                inventoryNew.getItem().getName(),
                inventoryNew.getItem().getPrice(),
                inventoryNew.getItem().getItemType(),
                inventoryNew.getItem().getEffectType(),
                inventoryNew.getItem().getDescription(),
                inventoryNew.getQuantity()
        );
    }
}
