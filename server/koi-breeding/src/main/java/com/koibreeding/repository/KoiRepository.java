package com.koibreeding.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.koibreeding.domain.Koi;

public interface KoiRepository extends JpaRepository<Koi, Integer> {
    List<Koi> findTop3ByOrderByIdDesc();
}
