package com.koibreeding.controller;

import com.koibreeding.dto.response.ResItemInventory;
import com.koibreeding.service.InventoryService;
import com.koibreeding.util.error.IdInvalidException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class InventoryController {
    private final InventoryService inventoryService;

    @GetMapping("/inventory")
    public ResponseEntity<List<ResItemInventory>> getInventory(@RequestParam Integer userId) {
        if (userId == null) {
            throw new IdInvalidException("inventory with userId " + userId + " not found");
        }

        List<ResItemInventory> inventory = inventoryService.getInventory(userId);
        return ResponseEntity.ok(inventory);
    }

    @PostMapping("/inventory/items/{itemId}/addition")
    public ResponseEntity<ResItemInventory> addItemToInventory(
            @RequestParam Integer userId,
            @PathVariable Integer itemId,
            @RequestBody ResItemInventory request) {
        if (userId == null) {
            throw new IdInvalidException("inventory with userId " + userId + " not found");
        }

        if (itemId == null) {
            throw new IdInvalidException("inventory with itemId " + itemId + " not found");
        }
        return ResponseEntity.status(HttpStatus.OK)
                .body(this.inventoryService
                        .addItemToInventory(userId, itemId, request.getQuantity()));
    }

    @PostMapping("/inventory/items/{itemId}/usages")
    public ResponseEntity<ResItemInventory> useItemFromInventory(
            @RequestParam Integer userId,
            @PathVariable Integer itemId,
            @RequestBody ResItemInventory request) {
        if (userId == null) {
            throw new IdInvalidException("inventory with userId " + userId + " not found");
        }

        if (itemId == null) {
            throw new IdInvalidException("inventory with itemId " + itemId + " not found");
        }
        return ResponseEntity.status(HttpStatus.OK)
                .body(this.inventoryService
                        .useItemFromInventory(userId, itemId, request.getQuantity()));
    }
}
