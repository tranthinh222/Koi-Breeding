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
import com.koibreeding.domain.response.ResultPaginationDTO;
import com.koibreeding.service.KoiDictionaryService;

@RestController
@RequestMapping("/api/v1")
public class KoiDictionaryDictionaryController {
    private final KoiDictionaryService koiDictionaryService;

    public KoiDictionaryDictionaryController(KoiDictionaryService koiDictionaryService) {
        this.koiDictionaryService = koiDictionaryService;
    }

    @PostMapping("/dictionaries")
    public ResponseEntity<KoiDictionary> createNewKoiDictionary(@RequestBody KoiDictionary koiDictionary) {
        KoiDictionary newKoiDictionary = this.koiDictionaryService.handleCreateKoiDictionary(koiDictionary);

        return ResponseEntity.status(HttpStatus.CREATED).body(newKoiDictionary);
    }

    @PutMapping("/dictionaries")
    public ResponseEntity<KoiDictionary> updateAKoiDictionary(@RequestBody KoiDictionary koiDictionary)
            throws Exception {
        if (this.koiDictionaryService.isKoiDictionaryExistById(koiDictionary.getId())) {
            throw new Exception("KoiDictionary with id '" + koiDictionary.getId() + "' is not exist.");
        }

        KoiDictionary updatedKoiDictionary = this.koiDictionaryService.handleUpdateKoiDictionary(koiDictionary);

        return ResponseEntity.ok(updatedKoiDictionary);
    }

    @GetMapping("/dictionaries/{id}")
    public ResponseEntity<KoiDictionary> getKoiDictionaryById(@PathVariable Integer id) throws Exception {
        KoiDictionary fetchedKoiDictionary = koiDictionaryService.handleFetchKoiDictionaryById(id);
        if (fetchedKoiDictionary == null) {
            throw new Exception("KoiDictionary with id '" + id + "' is not exist.");
        }

        return ResponseEntity.ok(fetchedKoiDictionary);
    }

    @GetMapping("/dictionaries")
    public ResponseEntity<ResultPaginationDTO> getAllKoiDictionarys(Pageable pageable) {
        ResultPaginationDTO koiDictionaryList = koiDictionaryService.handleFetchAllKoiDictionaries(pageable);

        return ResponseEntity.ok(koiDictionaryList);
    }

    @DeleteMapping("/dictionaries/{id}")
    public ResponseEntity<Void> deleteKoiDictionary(@PathVariable Integer id) throws Exception {
        if (!koiDictionaryService.isKoiDictionaryExistById(id)) {
            throw new Exception("KoiDictionary with id '" + id + "' is not exist.");
        }

        this.koiDictionaryService.handleDeleteKoiDictionary(id);

        return ResponseEntity.ok().build();
    }
}
