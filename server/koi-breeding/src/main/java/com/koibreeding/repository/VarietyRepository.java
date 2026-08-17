package com.koibreeding.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.koibreeding.domain.Variety;

public interface VarietyRepository extends JpaRepository<Variety, Integer> {
}
