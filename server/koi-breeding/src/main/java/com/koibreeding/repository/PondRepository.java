package com.koibreeding.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.koibreeding.domain.Pond;

public interface PondRepository extends JpaRepository<Pond, Integer> {
    Page<Pond> findAllByOwner_Id(Integer ownerId, Pageable pageable);

    List<Pond> findByOwner_IdAndName(Integer ownerId, String name);

    Optional<Pond> findFirstByOwner_IdOrderByIdAsc(Integer ownerId);
}
