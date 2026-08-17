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

import com.koibreeding.domain.Dictionary;
import com.koibreeding.dto.response.ResultPaginationDTO;
import com.koibreeding.service.DictionaryService;
import com.koibreeding.util.annotation.ApiMessage;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1")
public class DictionaryController {
    private final DictionaryService koiDictionaryService;

    public DictionaryController(DictionaryService koiDictionaryService) {
        this.koiDictionaryService = koiDictionaryService;
    }

    @ApiMessage("Create a new koi varient in dictionary")
    @PostMapping("/dictionaries")
    public ResponseEntity<Dictionary> createNewDictionary(@Valid @RequestBody Dictionary koiDictionary) {
        Dictionary newDictionary = this.koiDictionaryService.handleCreateDictionary(koiDictionary);

        return ResponseEntity.status(HttpStatus.CREATED).body(newDictionary);
    }

    @ApiMessage("Update a koi varient in dictionary")
    @PutMapping("/dictionaries")
    public ResponseEntity<Dictionary> updateADictionary(@Valid @RequestBody Dictionary koiDictionary)
            throws Exception {
        if (!this.koiDictionaryService.isDictionaryExistById(koiDictionary.getId())) {
            throw new Exception("Dictionary with id '" + koiDictionary.getId() + "' is not exist.");
        }

        Dictionary updatedDictionary = this.koiDictionaryService.handleUpdateDictionary(koiDictionary);

        return ResponseEntity.ok(updatedDictionary);
    }

    @ApiMessage("Get a koi varient in dictionary")
    @GetMapping("/dictionaries/{id}")
    public ResponseEntity<Dictionary> getDictionaryById(@PathVariable Integer id) throws Exception {
        Dictionary fetchedDictionary = koiDictionaryService.handleFetchDictionaryById(id);
        if (fetchedDictionary == null) {
            throw new Exception("Dictionary with id '" + id + "' is not exist.");
        }

        return ResponseEntity.ok(fetchedDictionary);
    }

    @ApiMessage("Get all koi varients in dictionary with pagination")
    @GetMapping("/dictionaries")
    public ResponseEntity<ResultPaginationDTO> getAllKoiDictionaries(Pageable pageable) {
        ResultPaginationDTO koiDictionaryList = koiDictionaryService.handleFetchAllKoiDictionaries(pageable);

        return ResponseEntity.ok(koiDictionaryList);
    }

    @ApiMessage("Delete a koi varient in dictionary")
    @DeleteMapping("/dictionaries/{id}")
    public ResponseEntity<Void> deleteDictionary(@PathVariable Integer id) throws Exception {
        if (!koiDictionaryService.isDictionaryExistById(id)) {
            throw new Exception("Dictionary with id '" + id + "' is not exist.");
        }

        this.koiDictionaryService.handleDeleteDictionary(id);

        return ResponseEntity.ok().build();
    }
}
