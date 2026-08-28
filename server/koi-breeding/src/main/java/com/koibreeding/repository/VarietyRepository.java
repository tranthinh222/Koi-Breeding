package com.koibreeding.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.koibreeding.domain.Variety;

public interface VarietyRepository extends JpaRepository<Variety, Integer> {
    Optional<Variety> findByName(String name);
}
