package com.koibreeding.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.koibreeding.dto.response.ResItemInventory;
import com.koibreeding.enums.ItemType;
import com.koibreeding.service.InventoryService;
import com.koibreeding.util.error.IdInvalidException;

import lombok.RequiredArgsConstructor;

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

    @GetMapping("/inventory/type")
    public ResponseEntity<List<ResItemInventory>> getUserInventoryByItemType(@RequestParam Integer userId,
            @RequestParam ItemType itemType) {
        if (userId == null) {
            throw new IdInvalidException("Inventory with userId " + userId + " not found");
        }

        if (itemType == null) {
            throw new RuntimeException("Item type cannot be null");
        }

        return ResponseEntity.ok(this.inventoryService.handleFetchUserInventoryByItemType(userId, itemType));
    }
}
