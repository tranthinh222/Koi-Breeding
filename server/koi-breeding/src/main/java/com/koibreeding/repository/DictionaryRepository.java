package com.koibreeding.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.koibreeding.domain.Dictionary;

public interface DictionaryRepository extends JpaRepository<Dictionary, Integer> {
}
