package com.koibreeding.controller;

import com.koibreeding.domain.Item;
import com.koibreeding.dto.response.ResItemInventory;
import com.koibreeding.enums.ItemType;
import com.koibreeding.service.ShopService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ShopController {
    private final ShopService shopService;
    // private final ItemService itemService;

    @GetMapping("/shop/items")
    public ResponseEntity<Page<Item>> fetchItems(
            @RequestParam(required = false) ItemType category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.status(HttpStatus.OK).body(this.shopService.getItems(category, page, size));
    }

    // @GetMapping("/shop/items/{itemId}")
    // public ResponseEntity<Item> fetchAnItem(@RequestParam("itemId") int id) {
    // Item item = this.itemService.findItemById(id);
    // if (item == null) {
    // throw new IdInvalidException("item with id " + id + " not found");
    // }
    // return ResponseEntity.status(HttpStatus.OK).body(item);
    // }

    @PostMapping("/shop/items/{itemId}/purchase")
    public ResponseEntity<Void> purchaseShopItem(
            // @PathVariable Integer userId,
            @PathVariable Integer itemId,
            @RequestBody ResItemInventory request) {
        Integer userId = 1;
        shopService.purchaseShopItem(userId, itemId, request.getQuantity());
        return ResponseEntity.ok().build();
    }
}
