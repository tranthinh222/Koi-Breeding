package com.koibreeding.service;

import com.koibreeding.domain.Inventory;
import com.koibreeding.domain.Item;
import com.koibreeding.domain.User;
import com.koibreeding.repository.InventoryRepository;
import com.koibreeding.repository.ItemRepository;
import com.koibreeding.repository.UserRepository;
import com.koibreeding.response.ItemResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryService {
    private final InventoryRepository inventoryRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final ItemRepository itemRepository;
    private final ItemService itemService;
    public InventoryService(
            InventoryRepository inventoryRepository,
            UserRepository userRepository,
            UserService userService,
            ItemRepository itemRepository,
            ItemService itemService){
        this.inventoryRepository = inventoryRepository;
        this.userRepository = userRepository;
        this.userService = userService;
        this.itemRepository = itemRepository;
        this.itemService = itemService;
    }

    public Inventory handleCreateInventory(Inventory inventory){
         return inventoryRepository.save(inventory);
    }

    public List<ItemResponse> seeInventory(Integer userId){
        return inventoryRepository.findByUserId(userId)
                .stream()
                .map(inventory -> new ItemResponse(
                        inventory.getItem().getId(),
                        inventory.getItem().getName(),
                        inventory.getItem().getPrice(),
                        inventory.getItem().getItemType(),
                        inventory.getItem().getEffectType(),
                        inventory.getItem().getEffectValue(),
                        inventory.getItem().getDescription(),
                        inventory.getQuantity()
                )).toList();
    }

    public ItemResponse addItemToInventory(Integer userId, Integer itemId, Integer quantity){
        Inventory inventory = inventoryRepository.findByUserIdAndItemId(userId, itemId).orElse(null);
        User user = userService.handleFetchUser(userId);
        Item item = itemService.handleFetchItem(itemId);
                if(inventory == null){
                    inventory = new Inventory();
                    inventory.setUser(user);
                    inventory.setItem(item);
                    inventory.setQuantity(quantity);

                }else {
                    inventory.setQuantity(inventory.getQuantity()+quantity);
                }

                Inventory inventoryNew = handleCreateInventory(inventory);
                return new ItemResponse(
                        inventoryNew.getItem().getId(),
                        inventoryNew.getItem().getName(),
                        inventoryNew.getItem().getPrice(),
                        inventoryNew.getItem().getItemType(),
                        inventoryNew.getItem().getEffectType(),
                        inventoryNew.getItem().getEffectValue(),
                        inventoryNew.getItem().getDescription(),
                        inventoryNew.getQuantity()
                );

    }

    public ItemResponse useItem(Integer userId, Integer itemId, Integer quantity){
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
        return  new ItemResponse(
                inventoryNew.getItem().getId(),
                inventoryNew.getItem().getName(),
                inventoryNew.getItem().getPrice(),
                inventoryNew.getItem().getItemType(),
                inventoryNew.getItem().getEffectType(),
                inventoryNew.getItem().getEffectValue(),
                inventoryNew.getItem().getDescription(),
                inventoryNew.getQuantity()
        );
    }
}
