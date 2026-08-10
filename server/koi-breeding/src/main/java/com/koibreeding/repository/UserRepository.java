package com.koibreeding.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.koibreeding.domain.User;

public interface UserRepository extends JpaRepository<User, Integer> {
}
