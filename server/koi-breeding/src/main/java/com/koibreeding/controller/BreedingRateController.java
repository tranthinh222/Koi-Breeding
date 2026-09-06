package com.koibreeding.controller;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.koibreeding.domain.BreedingRate;
import com.koibreeding.dto.response.ResultPaginationDTO;
import com.koibreeding.enums.BreedingRecipeType;
import com.koibreeding.enums.ScaleType;
import com.koibreeding.enums.Shape;
import com.koibreeding.service.BreedingRateService;
import com.koibreeding.util.annotation.ApiMessage;

@RestController
@RequestMapping("/api/v1")
public class BreedingRateController {
    private final BreedingRateService service;

    public BreedingRateController(BreedingRateService service) {
        this.service = service;
    }

    @ApiMessage("Search all breeding rates with specific condition")
    @GetMapping("/breeding-rates")
    public ResponseEntity<ResultPaginationDTO> search(@RequestParam(required = false) String search,
            @RequestParam(required = false) BreedingRecipeType type, @RequestParam(required = false) Integer varietyId,
            @RequestParam(required = false) Shape shape, @RequestParam(required = false) ScaleType scaleType,
            Pageable pageable) {
        return ResponseEntity.ok(service.search(search, type, varietyId, shape, scaleType, pageable));
    }

    @ApiMessage("Find all breeding rate from parent combination")
    @GetMapping("/breeding-rates/pair")
    public ResponseEntity<List<BreedingRate>> pair(@RequestParam Integer fatherId, @RequestParam Integer motherId) {
        return ResponseEntity.ok(service.findPairIncludingReverse(fatherId, motherId));
    }
}
