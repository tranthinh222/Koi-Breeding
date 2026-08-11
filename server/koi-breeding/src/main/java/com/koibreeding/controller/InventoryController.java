package com.koibreeding.controller;

import com.koibreeding.response.ItemResponse;
import com.koibreeding.service.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/inventory")
public class InventoryController {
    private final InventoryService inventoryService;
    public InventoryController(InventoryService inventoryService){
        this.inventoryService = inventoryService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<ItemResponse>> seeInventory(
            @PathVariable Integer userId
    ){
        return ResponseEntity.ok(
                inventoryService.seeInventory(userId).stream().toList()
        );
    }

    @PostMapping("/addItem/{userId}")
    public ResponseEntity<ItemResponse> addItem(
            @PathVariable Integer userId,
            @RequestBody ItemResponse item
    ){
       ItemResponse items = inventoryService.addItemToInventory(userId, item.getId(), item.getQuantity());
        return ResponseEntity.ok(items);
    }

    @PostMapping("/useItem/{userId}")
    public ResponseEntity<ItemResponse> useItem(
            @PathVariable Integer userId,
            @RequestBody ItemResponse item
    ){
        ItemResponse items = inventoryService.useItem(userId, item.getId(), item.getQuantity());
        return ResponseEntity.ok(items);
    }
}
