package com.koibreeding.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.koibreeding.domain.Dictionary;

public interface KoiDictionaryRepository extends JpaRepository<Dictionary, Integer> {
}
