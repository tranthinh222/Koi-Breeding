package com.koibreeding.repository;

import com.koibreeding.domain.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Integer> {
    List<Transaction> findByWalletUserIdOrderByCreatedAtDesc(Integer userId);

    List<Transaction> findByItemIsNull();
}
