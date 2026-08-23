package com.koibreeding.controller;

import com.koibreeding.dto.response.ResMarketDto;
import com.koibreeding.service.MarketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class MarketController {

    private final MarketService marketService;

    @GetMapping("/marketplace")
    public ResponseEntity<List<ResMarketDto>> getMarketplace(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) BigDecimal minLength,
            @RequestParam(required = false) BigDecimal maxLength,
            @RequestParam(required = false) BigDecimal minWeight,
            @RequestParam(required = false) BigDecimal maxWeight,
            @RequestParam(required = false) String gender
    ) {

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
                        gender
                )
        );
    }
}