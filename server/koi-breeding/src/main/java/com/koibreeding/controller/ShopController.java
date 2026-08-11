package com.koibreeding.controller;

import com.koibreeding.domain.Item;
import com.koibreeding.response.ItemResponse;
import com.koibreeding.service.ShopService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/shop")
public class ShopController {
    private final ShopService shopService;
    public ShopController(ShopService shopService){
        this.shopService = shopService;
    }

    @GetMapping
    public ResponseEntity<List<Item>> listItem(){
        List<Item> items = shopService.listItem().stream().toList();
        return ResponseEntity.ok(items);
    }

    @PostMapping("/buyItem/{userId}")
    public ResponseEntity<Void> buyItem(
            @PathVariable Integer userId,
            @RequestBody ItemResponse item
    ){
        shopService.buyItem(userId, item.getId(), item.getQuantity());
        return ResponseEntity.ok().build();
    }
}
