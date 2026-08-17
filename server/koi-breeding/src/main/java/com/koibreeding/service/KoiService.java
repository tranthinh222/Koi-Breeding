package com.koibreeding.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.koibreeding.domain.Koi;
import com.koibreeding.domain.Dictionary;
import com.koibreeding.domain.Mutation;
import com.koibreeding.domain.Pond;
import com.koibreeding.dto.response.ResultPaginationDTO;
import com.koibreeding.repository.KoiRepository;

@Service
public class KoiService {
    private final KoiRepository koiRepository;
    private final MutationService mutationService;
    private final KoiDictionaryService koiDictionaryService;
    private final PondService pondService;

    public KoiService(
            KoiRepository koiRepository,
            MutationService mutationService,
            KoiDictionaryService koiDictionaryService,
            PondService pondService) {
        this.koiRepository = koiRepository;
        this.mutationService = mutationService;
        this.koiDictionaryService = koiDictionaryService;
        this.pondService = pondService;
    }

    public Koi handleCreateKoi(Koi koi) {
        return this.koiRepository.save(koi);
    }

    public Koi handleUpdateKoi(Koi koi) {
        Koi currentKoi = this.handleFetchKoiById(koi.getId());
        if (currentKoi != null) {
            currentKoi.setName(koi.getName() != null ? koi.getName() : currentKoi.getName());
            currentKoi.setAge(koi.getAge() != null ? koi.getAge() : currentKoi.getAge());
            currentKoi.setGender(koi.getGender() != null ? koi.getGender() : currentKoi.getGender());
            currentKoi.setLength(koi.getLength() != null ? koi.getLength() : currentKoi.getLength());
            currentKoi.setWeight(koi.getWeight() != null ? koi.getWeight() : currentKoi.getWeight());
            currentKoi.setHealth(koi.getHealth() != null ? koi.getHealth() : currentKoi.getHealth());
            currentKoi.setFoodBar(koi.getFoodBar() != null ? koi.getFoodBar() : currentKoi.getFoodBar());
            currentKoi.setCureBar(koi.getCureBar() != null ? koi.getCureBar() : currentKoi.getCureBar());
            currentKoi.setPrice(koi.getPrice() != null ? koi.getPrice() : currentKoi.getPrice());

            if (koi.getMutation() != null) {
                Mutation mutation = this.mutationService.handleFetchMutationById(koi.getMutation().getId());
                currentKoi.setMutation(mutation);
            }

            if (koi.getPond() != null) {
                Pond pond = this.pondService.handleFetchPondById(koi.getPond().getId());
                currentKoi.setPond(pond);
            }

            currentKoi.setPond(new Pond());
            currentKoi.setLifeStage(koi.getLifeStage() != null ? koi.getLifeStage() : currentKoi.getLifeStage());
            currentKoi.setFather(koi.getFather() != null ? koi.getFather() : currentKoi.getFather());
            currentKoi.setMother(koi.getMother() != null ? koi.getMother() : currentKoi.getMother());
            currentKoi.setPotential(koi.getPotential() != null ? koi.getPotential() : currentKoi.getPotential());

            if (koi.getDictionary() != null) {
                Dictionary koiDictionary = this.koiDictionaryService
                        .handleFetchKoiDictionaryById(koi.getDictionary().getId());
                currentKoi.setDictionary(koiDictionary);
            }

            currentKoi.setPatternScore(
                    koi.getPatternScore() != null ? koi.getPatternScore() : currentKoi.getPatternScore());
            currentKoi.setColorScore(koi.getColorScore() != null ? koi.getColorScore() : currentKoi.getColorScore());
            currentKoi.setBodyScore(koi.getBodyScore() != null ? koi.getBodyScore() : currentKoi.getBodyScore());
            currentKoi.setSkinScore(koi.getSkinScore() != null ? koi.getSkinScore() : currentKoi.getSkinScore());
            currentKoi.setScaleScore(koi.getScaleScore() != null ? koi.getScaleScore() : currentKoi.getScaleScore());

            currentKoi = this.koiRepository.save(currentKoi);
        }

        return currentKoi;
    }

    public Koi handleFetchKoiById(Integer id) {
        return koiRepository.findById(id).orElse(null);
    }

    public ResultPaginationDTO handleFetchAllKois(Pageable pageable) {
        Page<Koi> pageKoi = this.koiRepository.findAll(pageable);
        ResultPaginationDTO resultPaginationDTO = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setTotalPages(pageKoi.getTotalPages());
        meta.setTotalElements(pageKoi.getTotalElements());

        resultPaginationDTO.setMeta(meta);

        List<Koi> koiList = pageKoi.getContent();

        resultPaginationDTO.setResult(koiList);

        return resultPaginationDTO;
    }

    public void handleDeleteKoi(Integer id) {
        this.koiRepository.deleteById(id);
    }

    public boolean isKoiExistById(Integer id) {
        return this.koiRepository.existsById(id);
    }
}
