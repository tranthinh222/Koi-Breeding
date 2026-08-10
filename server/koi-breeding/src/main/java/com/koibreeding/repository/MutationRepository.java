package com.koibreeding.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.koibreeding.domain.Mutation;

public interface MutationRepository extends JpaRepository<Mutation, Integer> {
}
