package com.koibreeding.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.koibreeding.domain.Mutation;
import com.koibreeding.dto.response.ResultPaginationDTO;
import com.koibreeding.service.MutationService;

@RestController
@RequestMapping("/api/v1")
public class MutationController {
    private final MutationService mutationService;

    public MutationController(MutationService mutationService) {
        this.mutationService = mutationService;
    }

    @PostMapping("/mutations")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Mutation> createNewMutation(@RequestBody Mutation mutation) {
        Mutation newMutation = this.mutationService.handleCreateMutation(mutation);

        return ResponseEntity.status(HttpStatus.CREATED).body(newMutation);
    }

    @PutMapping("/mutations")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Mutation> updateAMutation(@RequestBody Mutation mutation) throws Exception {
        if (this.mutationService.isMutationExistById(mutation.getId())) {
            throw new Exception("Mutation with id '" + mutation.getId() + "' is not exist.");
        }

        Mutation updatedMutation = this.mutationService.handleUpdateMutation(mutation);

        return ResponseEntity.ok(updatedMutation);
    }

    @GetMapping("/mutations/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Mutation> getMutationById(@PathVariable Integer id) throws Exception {
        Mutation fetchedMutation = mutationService.handleFetchMutationById(id);
        if (fetchedMutation == null) {
            throw new Exception("Mutation with id '" + id + "' is not exist.");
        }

        return ResponseEntity.ok(fetchedMutation);
    }

    @GetMapping("/mutations")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResultPaginationDTO> getAllMutations(Pageable pageable) {
        ResultPaginationDTO mutationList = mutationService.handleFetchAllMutations(pageable);

        return ResponseEntity.ok(mutationList);
    }

    @DeleteMapping("/mutations/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMutation(@PathVariable Integer id) throws Exception {
        if (!mutationService.isMutationExistById(id)) {
            throw new Exception("Mutation with id '" + id + "' is not exist.");
        }

        this.mutationService.handleDeleteMutation(id);

        return ResponseEntity.ok().build();
    }
}
