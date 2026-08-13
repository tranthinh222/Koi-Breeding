package com.koibreeding.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.koibreeding.domain.Variety;
import com.koibreeding.domain.response.ResultPaginationDTO;
import com.koibreeding.repository.VarietyRepository;

@Service
public class VarietyService {
    private final VarietyRepository varietyRepository;

    public VarietyService(VarietyRepository varietyRepository) {
        this.varietyRepository = varietyRepository;
    }

    public Variety handleCreateVariety(Variety variety) {
        return this.varietyRepository.save(variety);
    }

    public Variety handleUpdateVariety(Variety variety) {
        Variety currentVariety = this.handleFetchVarietyById(variety.getId());
        if (currentVariety != null) {
            currentVariety.setName(variety.getName() != null ? variety.getName() : currentVariety.getName());
            currentVariety.setDescription(
                    variety.getDescription() != null ? variety.getDescription() : currentVariety.getDescription());

            currentVariety = this.varietyRepository.save(currentVariety);
        }

        return currentVariety;
    }

    public Variety handleFetchVarietyById(Integer id) {
        return varietyRepository.findById(id).orElse(null);
    }

    public ResultPaginationDTO handleFetchAllVarieties(Pageable pageable) {
        Page<Variety> pageVariety = this.varietyRepository.findAll(pageable);
        ResultPaginationDTO resultPaginationDTO = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setTotalPages(pageVariety.getTotalPages());
        meta.setTotalElements(pageVariety.getTotalElements());

        resultPaginationDTO.setMeta(meta);

        List<Variety> varietyList = pageVariety.getContent();

        resultPaginationDTO.setResult(varietyList);

        return resultPaginationDTO;
    }

    public void handleDeleteVariety(Integer id) {
        this.varietyRepository.deleteById(id);
    }

    public boolean isVarietyExistById(Integer id) {
        return this.varietyRepository.existsById(id);
    }
}
