package com.koibreeding.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.koibreeding.domain.BreedingRate;
import com.koibreeding.repository.BreedingRateRepository;

@Service
public class BreedingRateService {
    private final BreedingRateRepository breedingRateRepository;

    public BreedingRateService(BreedingRateRepository breedingRateRepository) {
        this.breedingRateRepository = breedingRateRepository;
    }

    public BreedingRate handleCreateBreedingRate(BreedingRate breedingRate) {
        return this.breedingRateRepository.save(breedingRate);
    }

    public BreedingRate handleUpdateBreedingRate(BreedingRate breedingRate) {
        BreedingRate currentBreedingRate = this.handleFetchBreedingRateById(breedingRate.getId());
        if (currentBreedingRate != null) {
            currentBreedingRate.setFather(breedingRate.getFather() != null ? breedingRate.getFather()
                    : currentBreedingRate.getFather());
            currentBreedingRate.setMother(breedingRate.getMother() != null ? breedingRate.getMother()
                    : currentBreedingRate.getMother());
            currentBreedingRate.setChild(breedingRate.getChild() != null ? breedingRate.getChild()
                    : currentBreedingRate.getChild());
            currentBreedingRate.setType(breedingRate.getType() != null ? breedingRate.getType()
                    : currentBreedingRate.getType());
            currentBreedingRate.setTargetRate(breedingRate.getTargetRate() != null ? breedingRate.getTargetRate()
                    : currentBreedingRate.getTargetRate());
            currentBreedingRate.setFatherRate(breedingRate.getFatherRate() != null ? breedingRate.getFatherRate()
                    : currentBreedingRate.getFatherRate());
            currentBreedingRate.setMotherRate(breedingRate.getMotherRate() != null ? breedingRate.getMotherRate()
                    : currentBreedingRate.getMotherRate());

            return this.breedingRateRepository.save(currentBreedingRate);
        }
        return null;
    }

    public BreedingRate handleFetchBreedingRateById(Integer id) {
        return this.breedingRateRepository.findById(id).orElse(null);
    }

    public List<BreedingRate> handleFetchBreedingRateByFatherAndMother(Integer fatherId, Integer motherId) {
        return this.breedingRateRepository.findByFatherIdAndMotherId(fatherId, motherId);
    }

    public void handleDeleteBreedingRateById(Integer id) {
        this.breedingRateRepository.deleteById(id);
    }
}
