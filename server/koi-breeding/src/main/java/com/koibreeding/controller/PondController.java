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
import org.springframework.web.bind.annotation.RestController;

import com.koibreeding.domain.Pond;
import com.koibreeding.domain.response.ResultPaginationDTO;
import com.koibreeding.service.PondService;

@RestController
@RequestMapping("/api/v1")
public class PondController {
    private final PondService pondService;

    public PondController(PondService pondService) {
        this.pondService = pondService;
    }

    @PostMapping("/ponds")
    public ResponseEntity<Pond> createNewPond(@RequestBody Pond pond) {
        Pond newPond = this.pondService.handleCreatePond(pond);

        return ResponseEntity.status(HttpStatus.CREATED).body(newPond);
    }

    @PutMapping("/ponds")
    public ResponseEntity<Pond> updateAPond(@RequestBody Pond pond) throws Exception {
        if (!this.pondService.isPondExistById(pond.getId())) {
            throw new Exception("Pond with id '" + pond.getId() + "' is not exist.");
        }

        Pond updatedPond = this.pondService.handleUpdatePond(pond);

        return ResponseEntity.ok(updatedPond);
    }

    @GetMapping("/ponds/{id}")
    public ResponseEntity<Pond> getPondById(@PathVariable Integer id) throws Exception {
        Pond fetchedPond = pondService.handleFetchPondById(id);
        if (fetchedPond == null) {
            throw new Exception("Pond with id '" + id + "' is not exist.");
        }

        return ResponseEntity.ok(fetchedPond);
    }

    @GetMapping("/ponds")
    public ResponseEntity<ResultPaginationDTO> getAllPonds(Pageable pageable) {
        ResultPaginationDTO pondList = pondService.handleFetchAllPonds(pageable);

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
}
