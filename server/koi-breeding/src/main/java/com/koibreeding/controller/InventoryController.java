package com.koibreeding.controller;

import com.koibreeding.dto.response.ItemInventory;
import com.koibreeding.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(originPatterns = { "http://localhost:*", "http://127.0.0.1:*", "http://127.0.0.2:*" })
public class InventoryController {
    private final InventoryService inventoryService;
    @GetMapping("/inventory")
    public ResponseEntity<List<ItemInventory>> getInventory(
//            @PathVariable Integer userId
    ) {
        Integer userId = 1;
        List<ItemInventory> inventory = inventoryService.getInventory(userId);
        return ResponseEntity.ok(inventory);
    }

    @PostMapping("/inventory/items/{itemId}/addition")
    public ResponseEntity<ItemInventory> addItemToInventory(
//            @PathVariable Integer userId,
            @PathVariable Integer itemId,
            @RequestBody ItemInventory request
    ){
        Integer userId = 1;
        return ResponseEntity.status(HttpStatus.OK)
                .body(this.inventoryService
                        .addItemToInventory(userId, itemId, request.getQuantity()));
    }

    @PostMapping("/inventory/items/{itemId}/usages")
    public ResponseEntity<ItemInventory> useItemFromInventory(
//            @PathVariable Integer userId,
            @PathVariable Integer itemId,
            @RequestBody ItemInventory request
    ){
        Integer userId = 1;
        return ResponseEntity.status(HttpStatus.OK)
                .body(this.inventoryService
                        .useItemFromInventory(userId, itemId, request.getQuantity()));
    }
}
