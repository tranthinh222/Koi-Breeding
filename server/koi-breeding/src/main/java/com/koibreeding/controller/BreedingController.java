package com.koibreeding.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import com.koibreeding.dto.request.CreateBreedingEventRequest;
import com.koibreeding.dto.response.*;
import com.koibreeding.enums.*;
import com.koibreeding.service.BreedingService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/breeding-events")
public class BreedingController {
    private final BreedingService service;
    public BreedingController(BreedingService service) { this.service = service; }
    @PostMapping public ResponseEntity<ResBreedingEventDTO> create(@Valid @RequestBody CreateBreedingEventRequest request) { return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request)); }
    @GetMapping public ResponseEntity<ResultPaginationDTO> search(@RequestParam Integer userId,
            @RequestParam(required=false) String search, @RequestParam(required=false) BreedingType type,
            @RequestParam(required=false) BreedingStatus status, @RequestParam(required=false) Integer pondId,
            @RequestParam(required=false) Boolean ended, Pageable pageable) {
        return ResponseEntity.ok(service.search(userId, search, type, status, pondId, ended, pageable));
    }
    @PostMapping("/{id}/advance") public ResponseEntity<ResBreedingEventDTO> advance(@PathVariable Integer id, @RequestParam Integer userId) { return ResponseEntity.ok(service.advance(id, userId)); }
    @PostMapping("/{id}/cancel") public ResponseEntity<ResBreedingEventDTO> cancel(@PathVariable Integer id, @RequestParam Integer userId) { return ResponseEntity.ok(service.cancel(id, userId)); }
}
