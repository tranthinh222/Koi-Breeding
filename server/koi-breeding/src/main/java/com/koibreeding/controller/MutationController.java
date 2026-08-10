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

import com.koibreeding.domain.Mutation;
import com.koibreeding.domain.response.ResultPaginationDTO;
import com.koibreeding.service.MutationService;

@RestController
@RequestMapping("/api/v1")
public class MutationController {
    private final MutationService mutationService;

    public MutationController(MutationService mutationService) {
        this.mutationService = mutationService;
    }

    @PostMapping("/mutations")
    public ResponseEntity<Mutation> createNewMutation(@RequestBody Mutation mutation) {
        Mutation newMutation = this.mutationService.handleCreateMutation(mutation);

        return ResponseEntity.status(HttpStatus.CREATED).body(newMutation);
    }

    @PutMapping("/mutations")
    public ResponseEntity<Mutation> updateAMutation(@RequestBody Mutation mutation) throws Exception {
        if (this.mutationService.isMutationExistById(mutation.getId())) {
            throw new Exception("Mutation with id '" + mutation.getId() + "' is not exist.");
        }

        Mutation updatedMutation = this.mutationService.handleUpdateMutation(mutation);

        return ResponseEntity.ok(updatedMutation);
    }

    @GetMapping("/mutations/{id}")
    public ResponseEntity<Mutation> getMutationById(@PathVariable Integer id) throws Exception {
        Mutation fetchedMutation = mutationService.handleFetchMutationById(id);
        if (fetchedMutation == null) {
            throw new Exception("Mutation with id '" + id + "' is not exist.");
        }

        return ResponseEntity.ok(fetchedMutation);
    }

    @GetMapping("/mutations")
    public ResponseEntity<ResultPaginationDTO> getAllMutations(Pageable pageable) {
        ResultPaginationDTO mutationList = mutationService.handleFetchAllMutations(pageable);

        return ResponseEntity.ok(mutationList);
    }

    @DeleteMapping("/mutations/{id}")
    public ResponseEntity<Void> deleteMutation(@PathVariable Integer id) throws Exception {
        if (!mutationService.isMutationExistById(id)) {
            throw new Exception("Mutation with id '" + id + "' is not exist.");
        }

        this.mutationService.handleDeleteMutation(id);

        return ResponseEntity.ok().build();
    }
}
