package com.koibreeding.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.koibreeding.domain.BreedingRate;

public interface BreedingRateRepository extends JpaRepository<BreedingRate, Integer> {
    List<BreedingRate> findByFatherIdAndMotherId(Integer fatherId, Integer motherId);

    List<BreedingRate> findByChildId(Integer childId);

    List<BreedingRate> findByType(String type);

    List<BreedingRate> findByFatherIdAndMotherIdAndType(Integer fatherId, Integer motherId, String type);

    List<BreedingRate> findByChild_NameContainingIgnoreCase(String childName);
}
