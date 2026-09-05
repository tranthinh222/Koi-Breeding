package com.koibreeding.controller;

import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.koibreeding.domain.BreedingRate;
import com.koibreeding.dto.response.ResultPaginationDTO;
import com.koibreeding.enums.BreedingRecipeType;
import com.koibreeding.enums.ScaleType;
import com.koibreeding.enums.Shape;
import com.koibreeding.service.BreedingRateService;

@RestController
@RequestMapping("/api/v1/breeding-rates")
public class BreedingRateController {
    private final BreedingRateService service;
    public BreedingRateController(BreedingRateService service) { this.service = service; }
    @GetMapping
    public ResponseEntity<ResultPaginationDTO> search(@RequestParam(required=false) String search,
            @RequestParam(required=false) BreedingRecipeType type, @RequestParam(required=false) Integer varietyId,
            @RequestParam(required=false) Shape shape, @RequestParam(required=false) ScaleType scaleType,
            Pageable pageable) {
        return ResponseEntity.ok(service.search(search, type, varietyId, shape, scaleType, pageable));
    }
    @GetMapping("/pair")
    public ResponseEntity<List<BreedingRate>> pair(@RequestParam Integer fatherId, @RequestParam Integer motherId) {
        return ResponseEntity.ok(service.findPairIncludingReverse(fatherId, motherId));
    }
}
