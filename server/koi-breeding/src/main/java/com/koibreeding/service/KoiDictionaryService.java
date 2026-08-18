package com.koibreeding.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.koibreeding.domain.Dictionary;
import com.koibreeding.domain.Variety;
import com.koibreeding.dto.response.ResultPaginationDTO;
import com.koibreeding.repository.KoiDictionaryRepository;

@Service
public class KoiDictionaryService {
        private final KoiDictionaryRepository koiDictionaryRepository;
        private final VarietyService varietyService;

        public KoiDictionaryService(
                        KoiDictionaryRepository koiDictionaryRepository,
                        VarietyService varietyService) {
                this.koiDictionaryRepository = koiDictionaryRepository;
                this.varietyService = varietyService;
        }

        public Dictionary handleCreateKoiDictionary(Dictionary koiDictionary) {
                return this.koiDictionaryRepository.save(koiDictionary);
        }

        public Dictionary handleUpdateKoiDictionary(Dictionary koiDictionary) {
                Dictionary currentKoiDictionary = this.handleFetchKoiDictionaryById(koiDictionary.getId());
                if (currentKoiDictionary != null) {
                        currentKoiDictionary.setName(
                                        koiDictionary.getName() != null ? koiDictionary.getName()
                                                        : currentKoiDictionary.getName());
                        currentKoiDictionary.setShape(
                                        koiDictionary.getShape() != null ? koiDictionary.getShape()
                                                        : currentKoiDictionary.getShape());
                        currentKoiDictionary.setScaleType(
                                        koiDictionary.getScaleType() != null ? koiDictionary.getScaleType()
                                                        : currentKoiDictionary.getScaleType());

                        if (koiDictionary.getVariety() != null) {
                                Variety variety = this.varietyService
                                                .handleFetchVarietyById(koiDictionary.getVariety().getId());
                                currentKoiDictionary.setVariety(variety);
                        }

                        currentKoiDictionary.setOrigin(
                                        koiDictionary.getOrigin() != null ? koiDictionary.getOrigin()
                                                        : currentKoiDictionary.getOrigin());
                        currentKoiDictionary
                                        .setBaseMaxLength(koiDictionary.getBaseMaxLength() != null
                                                        ? koiDictionary.getBaseMaxLength()
                                                        : currentKoiDictionary.getBaseMaxLength());
                        currentKoiDictionary
                                        .setBaseGrowthRate(koiDictionary.getBaseGrowthRate() != null
                                                        ? koiDictionary.getBaseGrowthRate()
                                                        : currentKoiDictionary.getBaseGrowthRate());
                        currentKoiDictionary.setMidAge(
                                        koiDictionary.getMidAge() != null ? koiDictionary.getMidAge()
                                                        : currentKoiDictionary.getMidAge());
                        currentKoiDictionary.setAlphaWeight(
                                        koiDictionary.getAlphaWeight() != null ? koiDictionary.getAlphaWeight()
                                                        : currentKoiDictionary.getAlphaWeight());
                        currentKoiDictionary.setBasePrice(
                                        koiDictionary.getBasePrice() != null ? koiDictionary.getBasePrice()
                                                        : currentKoiDictionary.getBasePrice());
                        currentKoiDictionary.setAlphaPrice(
                                        koiDictionary.getAlphaPrice() != null ? koiDictionary.getAlphaPrice()
                                                        : currentKoiDictionary.getAlphaPrice());

                        currentKoiDictionary = this.koiDictionaryRepository.save(currentKoiDictionary);
                }

                return currentKoiDictionary;
        }

        public Dictionary handleFetchKoiDictionaryById(Integer id) {
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

        public void handleDeleteKoiDictionary(Integer id) {
                this.koiDictionaryRepository.deleteById(id);
        }

        public boolean isKoiDictionaryExistById(Integer id) {
                return this.koiDictionaryRepository.existsById(id);
        }
}
