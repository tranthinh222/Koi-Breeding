package com.koibreeding.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.koibreeding.domain.Mutation;
import com.koibreeding.domain.response.ResultPaginationDTO;
import com.koibreeding.repository.MutationRepository;

@Service
public class MutationService {
    private final MutationRepository mutationRepository;

    public MutationService(MutationRepository mutationRepository) {
        this.mutationRepository = mutationRepository;
    }

    public Mutation handleCreateMutation(Mutation mutation) {
        return this.mutationRepository.save(mutation);
    }

    public Mutation handleUpdateMutation(Mutation mutation) {
        Mutation currentMutation = this.handleFetchMutationById(mutation.getId());
        if (currentMutation != null) {
            currentMutation.setName(mutation.getName() != null ? mutation.getName() : currentMutation.getName());
            currentMutation.setRate(mutation.getRate() != null ? mutation.getRate() : currentMutation.getRate());
            currentMutation.setValue(mutation.getValue() != null ? mutation.getValue() : currentMutation.getValue());
            currentMutation.setDescription(
                    mutation.getDescription() != null ? mutation.getDescription() : currentMutation.getDescription());

            currentMutation = this.mutationRepository.save(currentMutation);
        }

        return currentMutation;
    }

    public Mutation handleFetchMutationById(Integer id) {
        return mutationRepository.findById(id).orElse(null);
    }

    public ResultPaginationDTO handleFetchAllMutations(Pageable pageable) {
        Page<Mutation> pageMutation = this.mutationRepository.findAll(pageable);
        ResultPaginationDTO resultPaginationDTO = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setTotalPages(pageMutation.getTotalPages());
        meta.setTotalElements(pageMutation.getTotalElements());

        resultPaginationDTO.setMeta(meta);

        List<Mutation> mutationList = pageMutation.getContent();

        resultPaginationDTO.setResult(mutationList);

        return resultPaginationDTO;
    }

    public void handleDeleteMutation(Integer id) {
        this.mutationRepository.deleteById(id);
    }

    public boolean isMutationExistById(Integer id) {
        return this.mutationRepository.existsById(id);
    }
}
