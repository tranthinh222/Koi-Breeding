package com.koibreeding.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.koibreeding.domain.Koi;
import com.koibreeding.dto.response.ResultPaginationDTO;
import com.koibreeding.service.KoiService;

@RestController
public class KoiController {
    private final KoiService koiService;

    public KoiController(KoiService koiService) {
        this.koiService = koiService;
    }

    @PostMapping("/kois")
    public ResponseEntity<Koi> createNewKoi(@RequestBody Koi koi) {
        Koi newKoi = this.koiService.handleCreateKoi(koi);

        return ResponseEntity.status(HttpStatus.CREATED).body(newKoi);
    }

    @PutMapping("/kois")
    public ResponseEntity<Koi> updateAKoi(@RequestBody Koi koi) throws Exception {
        if (koiService.isKoiExistById(koi.getId())) {
            throw new Exception("Koi with id '" + koi.getId() + "' is not exist.");
        }

        Koi updatedKoi = this.koiService.handleUpdateKoi(koi);

        return ResponseEntity.ok(updatedKoi);
    }

    @GetMapping("/kois/{id}")
    public ResponseEntity<Koi> getKoiById(@PathVariable Integer id) throws Exception {
        Koi fetchedKoi = koiService.handleFetchKoiById(id);
        if (fetchedKoi == null) {
            throw new Exception("Koi with id '" + id + "' is not exist.");
        }

        return ResponseEntity.ok(fetchedKoi);
    }

    @GetMapping("/kois")
    public ResponseEntity<ResultPaginationDTO> getAllKois(Pageable pageable) {
        ResultPaginationDTO koiList = koiService.handleFetchAllKois(pageable);

        return ResponseEntity.ok(koiList);
    }

    @DeleteMapping("/kois/{id}")
    public ResponseEntity<Void> deleteKoi(@PathVariable Integer id) throws Exception {
        if (!koiService.isKoiExistById(id)) {
            throw new Exception("Koi with id '" + id + "' is not exist.");
        }

        this.koiService.handleDeleteKoi(id);

        return ResponseEntity.ok().build();
    }
}
