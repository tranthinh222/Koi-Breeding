package com.koibreeding.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.koibreeding.domain.Transaction;
import com.koibreeding.enums.TransactionStatus;
import com.koibreeding.enums.TransactionType;

public interface TransactionRepository
        extends JpaRepository<Transaction, Integer>, JpaSpecificationExecutor<Transaction> {
    List<Transaction> findByWalletUserIdOrderByCreatedAtDesc(Integer userId);

    Page<Transaction> findByWalletUserId(Integer userId, Pageable pageable);

    Page<Transaction> findByWalletUserIdAndTransactionTypeIn(
            Integer userId,
            List<TransactionType> transactionTypes,
            Pageable pageable);

    boolean existsByWalletUserId(Integer userId);

    List<Transaction> findByItemIsNull();

    long countByCreatedAtBetween(java.time.OffsetDateTime start, java.time.OffsetDateTime end);

    List<Transaction> findByStatusOrderByAmountDesc(TransactionStatus status, Pageable pageable);
}
