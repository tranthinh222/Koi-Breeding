package com.koibreeding.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.koibreeding.domain.BreedingRate;

public interface BreedingRateRepository extends JpaRepository<BreedingRate, Integer>, JpaSpecificationExecutor<BreedingRate> {
    List<BreedingRate> findByFatherIdAndMotherId(Integer fatherId, Integer motherId);

    List<BreedingRate> findByChildId(Integer childId);

    List<BreedingRate> findByChild_NameContainingIgnoreCase(String childName);
}
