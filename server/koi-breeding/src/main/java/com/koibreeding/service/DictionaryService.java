package com.koibreeding.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.koibreeding.domain.Dictionary;
import com.koibreeding.domain.Variety;
import com.koibreeding.dto.response.ResultPaginationDTO;
import com.koibreeding.repository.DictionaryRepository;

@Service
public class DictionaryService {
    private final DictionaryRepository koiDictionaryRepository;
    private final VarietyService varietyService;

    public DictionaryService(
            DictionaryRepository koiDictionaryRepository,
            VarietyService varietyService) {
        this.koiDictionaryRepository = koiDictionaryRepository;
        this.varietyService = varietyService;
    }

    public Dictionary handleCreateDictionary(Dictionary koiDictionary) {
        return this.koiDictionaryRepository.save(koiDictionary);
    }

    public Dictionary handleUpdateDictionary(Dictionary koiDictionary) {
        Dictionary currentDictionary = this.handleFetchDictionaryById(koiDictionary.getId());
        if (currentDictionary != null) {
            currentDictionary.setName(
                    koiDictionary.getName() != null ? koiDictionary.getName()
                            : currentDictionary.getName());
            currentDictionary.setShape(
                    koiDictionary.getShape() != null ? koiDictionary.getShape()
                            : currentDictionary.getShape());
            currentDictionary.setScaleType(
                    koiDictionary.getScaleType() != null ? koiDictionary.getScaleType()
                            : currentDictionary.getScaleType());

            if (koiDictionary.getVariety() != null) {
                Variety variety = this.varietyService
                        .handleFetchVarietyById(koiDictionary.getVariety().getId());
                currentDictionary.setVariety(variety);
            }

            currentDictionary.setOrigin(
                    koiDictionary.getOrigin() != null ? koiDictionary.getOrigin()
                            : currentDictionary.getOrigin());
            currentDictionary
                    .setBaseMaxLength(koiDictionary.getBaseMaxLength() != null
                            ? koiDictionary.getBaseMaxLength()
                            : currentDictionary.getBaseMaxLength());
            currentDictionary
                    .setBaseGrowthRate(koiDictionary.getBaseGrowthRate() != null
                            ? koiDictionary.getBaseGrowthRate()
                            : currentDictionary.getBaseGrowthRate());
            currentDictionary.setMidAge(
                    koiDictionary.getMidAge() != null ? koiDictionary.getMidAge()
                            : currentDictionary.getMidAge());
            currentDictionary.setAlphaWeight(
                    koiDictionary.getAlphaWeight() != null ? koiDictionary.getAlphaWeight()
                            : currentDictionary.getAlphaWeight());
            currentDictionary.setBasePrice(
                    koiDictionary.getBasePrice() != null ? koiDictionary.getBasePrice()
                            : currentDictionary.getBasePrice());
            currentDictionary.setAlphaPrice(
                    koiDictionary.getAlphaPrice() != null ? koiDictionary.getAlphaPrice()
                            : currentDictionary.getAlphaPrice());

            currentDictionary
                    .setImageUrl(koiDictionary.getImageUrl() != null ? koiDictionary.getImageUrl()
                            : currentDictionary.getImageUrl());

            currentDictionary = this.koiDictionaryRepository.save(currentDictionary);
        }

        return currentDictionary;
    }

    public Dictionary handleFetchDictionaryById(Integer id) {
        return koiDictionaryRepository.findById(id).orElse(null);
    }

    public ResultPaginationDTO handleFetchAllKoiDictionaries(Pageable pageable) {
        Page<Dictionary> pageKoi = this.koiDictionaryRepository.findAll(pageable);
        ResultPaginationDTO resultPaginationDTO = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setTotalPages(pageKoi.getTotalPages());
        meta.setTotalElements(pageKoi.getTotalElements());

        resultPaginationDTO.setMeta(meta);

        List<Dictionary> koiDictionaryList = pageKoi.getContent();

        resultPaginationDTO.setResult(koiDictionaryList);

        return resultPaginationDTO;
    }

    public void handleDeleteDictionary(Integer id) {
        this.koiDictionaryRepository.deleteById(id);
    }

    public boolean isDictionaryExistById(Integer id) {
        return this.koiDictionaryRepository.existsById(id);
    }
}
