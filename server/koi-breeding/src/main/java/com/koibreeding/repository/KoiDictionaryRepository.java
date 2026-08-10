package com.koibreeding.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.koibreeding.domain.KoiDictionary;

public interface KoiDictionaryRepository extends JpaRepository<KoiDictionary, Integer> {
}
