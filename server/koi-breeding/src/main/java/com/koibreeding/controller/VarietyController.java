package com.koibreeding.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.koibreeding.domain.Variety;
import com.koibreeding.dto.response.ResultPaginationDTO;
import com.koibreeding.service.VarietyService;

@RestController
@RequestMapping("/api/v1")
public class VarietyController {
    private final VarietyService varietyService;

    public VarietyController(VarietyService varietyService) {
        this.varietyService = varietyService;
    }

    @PostMapping("/varieties")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Variety> createNewVariety(@RequestBody Variety variety) {
        Variety newVariety = this.varietyService.handleCreateVariety(variety);

        return ResponseEntity.status(HttpStatus.CREATED).body(newVariety);
    }

    @PutMapping("/varieties")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Variety> updateAVariety(@RequestBody Variety variety) throws Exception {
        if (!this.varietyService.isVarietyExistById(variety.getId())) {
            throw new Exception("Variety with id '" + variety.getId() + "' is not exist.");
        }

        Variety updatedVariety = this.varietyService.handleUpdateVariety(variety);

        return ResponseEntity.ok(updatedVariety);
    }

    @GetMapping("/varieties/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Variety> getVarietyById(@PathVariable Integer id) throws Exception {
        Variety fetchedVariety = varietyService.handleFetchVarietyById(id);
        if (fetchedVariety == null) {
            throw new Exception("Variety with id '" + id + "' is not exist.");
        }

        return ResponseEntity.ok(fetchedVariety);
    }

    @GetMapping("/varieties")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResultPaginationDTO> getAllVarieties(Pageable pageable) {
        ResultPaginationDTO varietyList = varietyService.handleFetchAllVarieties(pageable);

        return ResponseEntity.ok(varietyList);
    }

    @DeleteMapping("/varieties/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteVariety(@PathVariable Integer id) throws Exception {
        if (!varietyService.isVarietyExistById(id)) {
            throw new Exception("Variety with id '" + id + "' is not exist.");
        }

        this.varietyService.handleDeleteVariety(id);

        return ResponseEntity.ok().build();
    }
}
