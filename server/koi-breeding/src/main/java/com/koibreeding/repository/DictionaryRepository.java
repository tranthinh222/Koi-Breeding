package com.koibreeding.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.koibreeding.domain.Dictionary;

public interface DictionaryRepository extends JpaRepository<Dictionary, Integer>, JpaSpecificationExecutor<Dictionary> {
    List<Dictionary> findByNameIn(Iterable<String> name);
}
