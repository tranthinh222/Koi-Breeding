package com.koibreeding.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.koibreeding.domain.Pond;
import com.koibreeding.dto.request.RequestBuyPondDTO;
import com.koibreeding.dto.request.UsePondItemRequest;
import jakarta.validation.Valid;
import com.koibreeding.dto.response.ResPondDTO;
import com.koibreeding.dto.response.ResultPaginationDTO;
import com.koibreeding.service.PondService;

@RestController
@RequestMapping("/api/v1")
public class PondController {
    private final PondService pondService;

    public PondController(PondService pondService) {
        this.pondService = pondService;
    }

    @PostMapping("/ponds")
    public ResponseEntity<ResPondDTO> buyNewPond(@RequestBody RequestBuyPondDTO buyPondRequestDTO)
            throws Exception {
        ResPondDTO buyPondResponseDTO = null;
        try {
            buyPondResponseDTO = this.pondService.handleBuyPond(buyPondRequestDTO);
        } catch (Exception e) {
            throw e;
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(buyPondResponseDTO);
    }

    @PutMapping("/ponds")
    public ResponseEntity<ResPondDTO> updateAPond(@RequestBody Pond pond) throws Exception {
        if (!this.pondService.isPondExistById(pond.getId())) {
            throw new Exception("Pond with id '" + pond.getId() + "' is not exist.");
        }

        ResPondDTO updatedPond = this.pondService.handleUpdatePond(pond);

        return ResponseEntity.ok(updatedPond);
    }

    @GetMapping("/ponds/{id}")
    public ResponseEntity<ResPondDTO> getPondById(@PathVariable Integer id) throws Exception {
        ResPondDTO fetchedPond = pondService.convertToResPondDTO(pondService.handleFetchPondById(id));
        if (fetchedPond == null) {
            throw new Exception("Pond with id '" + id + "' is not exist.");
        }

        return ResponseEntity.ok(fetchedPond);
    }

    @GetMapping("/ponds")
    public ResponseEntity<ResultPaginationDTO> getAllPondsByOwner(@RequestParam("owner") Integer ownerId,
            Pageable pageable) {
        ResultPaginationDTO pondList = pondService.handleFetchPondsByOwner(ownerId, pageable);

        return ResponseEntity.ok(pondList);
    }

    @DeleteMapping("/ponds/{id}")
    public ResponseEntity<Void> deletePond(@PathVariable Integer id) throws Exception {
        if (!pondService.isPondExistById(id)) {
            throw new Exception("Pond with id '" + id + "' is not exist.");
        }

        this.pondService.handleDeletePond(id);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/ponds/{pondId}/items/{itemId}/usages")
    public ResponseEntity<ResPondDTO> useEnvironmentItem(@PathVariable Integer pondId,
            @PathVariable Integer itemId, @RequestParam Integer userId,
            @Valid @RequestBody UsePondItemRequest request) {
        int quantity = request.quantity() == null ? 1 : request.quantity();
        return ResponseEntity.ok(pondService.useEnvironmentItem(pondId, userId, itemId, quantity));
    }
}
