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

import com.koibreeding.domain.KoiDictionary;
import com.koibreeding.dto.response.ResultPaginationDTO;
import com.koibreeding.service.KoiDictionaryService;
import com.koibreeding.util.annotation.ApiMessage;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1")
public class KoiDictionaryController {
    private final KoiDictionaryService koiDictionaryService;

    public KoiDictionaryController(KoiDictionaryService koiDictionaryService) {
        this.koiDictionaryService = koiDictionaryService;
    }

    @ApiMessage("Create a new koi varient in dictionary")
    @PostMapping("/dictionaries")
    public ResponseEntity<KoiDictionary> createNewKoiDictionary(@Valid @RequestBody KoiDictionary koiDictionary) {
        KoiDictionary newKoiDictionary = this.koiDictionaryService.handleCreateKoiDictionary(koiDictionary);

        return ResponseEntity.status(HttpStatus.CREATED).body(newKoiDictionary);
    }

    @ApiMessage("Update a koi varient in dictionary")
    @PutMapping("/dictionaries")
    public ResponseEntity<KoiDictionary> updateAKoiDictionary(@Valid @RequestBody KoiDictionary koiDictionary)
            throws Exception {
        if (!this.koiDictionaryService.isKoiDictionaryExistById(koiDictionary.getId())) {
            throw new Exception("KoiDictionary with id '" + koiDictionary.getId() + "' is not exist.");
        }

        KoiDictionary updatedKoiDictionary = this.koiDictionaryService.handleUpdateKoiDictionary(koiDictionary);

        return ResponseEntity.ok(updatedKoiDictionary);
    }

    @ApiMessage("Get a koi varient in dictionary")
    @GetMapping("/dictionaries/{id}")
    public ResponseEntity<KoiDictionary> getKoiDictionaryById(@PathVariable Integer id) throws Exception {
        KoiDictionary fetchedKoiDictionary = koiDictionaryService.handleFetchKoiDictionaryById(id);
        if (fetchedKoiDictionary == null) {
            throw new Exception("KoiDictionary with id '" + id + "' is not exist.");
        }

        return ResponseEntity.ok(fetchedKoiDictionary);
    }

    @ApiMessage("Get all koi varients in dictionary with pagination")
    @GetMapping("/dictionaries")
    public ResponseEntity<ResultPaginationDTO> getAllKoiDictionaries(Pageable pageable) {
        ResultPaginationDTO koiDictionaryList = koiDictionaryService.handleFetchAllKoiDictionaries(pageable);

        return ResponseEntity.ok(koiDictionaryList);
    }

    @ApiMessage("Delete a koi varient in dictionary")
    @DeleteMapping("/dictionaries/{id}")
    public ResponseEntity<Void> deleteKoiDictionary(@PathVariable Integer id) throws Exception {
        if (!koiDictionaryService.isKoiDictionaryExistById(id)) {
            throw new Exception("KoiDictionary with id '" + id + "' is not exist.");
        }

        this.koiDictionaryService.handleDeleteKoiDictionary(id);

        return ResponseEntity.ok().build();
    }
}
