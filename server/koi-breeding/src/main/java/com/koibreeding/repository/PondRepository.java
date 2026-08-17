package com.koibreeding.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.koibreeding.domain.Pond;

public interface PondRepository extends JpaRepository<Pond, Integer> {
    Page<Pond> findAllByOwner(Integer ownerId, Pageable pageable);
}
