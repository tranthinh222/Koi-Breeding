package com.koibreeding.controller;

import com.koibreeding.domain.Inventory;
import com.koibreeding.service.InventoryService;
import com.koibreeding.util.annotation.ApiMessage;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class InventoryController {
        private final InventoryService inventoryService;

        // @GetMapping("/inventories/{id}")
        // @ApiMessage("fetch an inventory")
        // public ResponseEntity<Inventory> getInventoryById(@PathVariable("id") Long
        // id) {
        // Inventory inventory = this.inventoryService
        // }
}
