package com.koibreeding.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.koibreeding.domain.Wallet;

public interface WalletRepository extends JpaRepository<Wallet, Integer> {
    Optional<Wallet> findByUser_Id(Integer userId);
}
