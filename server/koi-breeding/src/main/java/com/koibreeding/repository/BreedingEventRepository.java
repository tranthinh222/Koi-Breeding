package com.koibreeding.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.koibreeding.domain.BreedingEvent;
import com.koibreeding.enums.BreedingStatus;

public interface BreedingEventRepository extends JpaRepository<BreedingEvent, Integer>,
        JpaSpecificationExecutor<BreedingEvent> {
    List<BreedingEvent> findByStatusNotIn(Collection<BreedingStatus> statuses);
}
