package com.koibreeding.repository;

import com.koibreeding.domain.User;
import com.koibreeding.enums.Role;

import java.time.Instant;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserRepository extends JpaRepository<User, Integer> {
    Page<User> findAllByRole(Role role, Pageable pageable);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    long countByCreatedAtBetween(Instant start, Instant end);
    List<User> findTopByOrderByExpDesc();
    List<User> findTop3ByOrderByExpDesc();
    Optional<User> findFirstByOrderByExpDesc();

}
