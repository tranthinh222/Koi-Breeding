package com.koibreeding.controller;

import com.koibreeding.domain.Item;
import com.koibreeding.enums.ItemType;
import com.koibreeding.repository.ItemRepository;
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
@CrossOrigin(originPatterns = { "http://localhost:*", "http://127.0.0.1:*", "http://127.0.0.2:*" })
public class ShopController {
    private final ShopService shopService;

    @GetMapping("/shop/products")
    public ResponseEntity<Page<Item>> getItems(
            @RequestParam(required = false) ItemType category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.status(HttpStatus.OK).body(this.shopService.getItems(category, page, size));
    }

    // @GetMapping("/shop/products/{id}")
    // public ResponseEntity<Page<Item>> getAnItem() {

    // }

}
