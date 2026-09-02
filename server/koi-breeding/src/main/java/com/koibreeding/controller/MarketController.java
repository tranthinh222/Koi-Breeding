package com.koibreeding.controller;

import com.koibreeding.dto.request.*;
import com.koibreeding.dto.response.ResMarketDto;
import com.koibreeding.dto.response.ResTradeDto;
import com.koibreeding.service.MarketService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class MarketController {

    private final MarketService marketService;

    @GetMapping("/marketplace")
    public ResponseEntity<Page<ResMarketDto>> getMarketplace(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) BigDecimal minLength,
            @RequestParam(required = false) BigDecimal maxLength,
            @RequestParam(required = false) BigDecimal minWeight,
            @RequestParam(required = false) BigDecimal maxWeight,
            @RequestParam(required = false) String gender,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "id")
        );

        return ResponseEntity.ok(
                marketService.filterMarketplace(
                        keyword,
                        category,
                        minPrice,
                        maxPrice,
                        minLength,
                        maxLength,
                        minWeight,
                        maxWeight,
                        gender,
                        pageable
                )
        );
    }

    @GetMapping("/marketplace/listKoi")
    public ResponseEntity<List<ResMarketListKoi>> getMarketListKois(
            @RequestParam Integer userId

    ){
        return ResponseEntity.ok(marketService.getMarketListKois(userId));
    }

    @GetMapping("/marketplace/koiPurchase")
    public ResponseEntity<List<ResMarketKois>> getMarketBuyKois(
            @RequestParam Integer userId
    ){
        return ResponseEntity.ok(marketService.getMarketListBuyKois(userId));
    }

    @PostMapping("/marketplace/saleKoi")
    public ResponseEntity<ResMarketDto> sellKoi(
            @RequestParam Integer userId,
            @RequestBody ResMarketSellKoi request
            ){
         return ResponseEntity.ok(marketService.sellKoi(userId, request));
    }

    @DeleteMapping("/marketplace/deletionKoi")
    public ResponseEntity<Void> deleteKoi(
            @RequestBody ReqMarketDeleteKoi request
            ){
        this.marketService.deleteKoi(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/marketplace/purchase")
    public ResponseEntity<ResTradeDto> buyKoiInMarket(
            @RequestParam Integer userId,
            @RequestBody ReqBuyKoi request
    ){
        return ResponseEntity.ok(marketService.buyKoi(userId, request));
    }
}