package com.koibreeding.repository;

import com.koibreeding.domain.Transaction;
import com.koibreeding.enums.TransactionStatus;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Integer>, JpaSpecificationExecutor<Transaction> {
    List<Transaction> findByWalletUserIdOrderByCreatedAtDesc(Integer userId);

    List<Transaction> findByItemIsNull();

    long countByCreatedAtBetween(java.time.OffsetDateTime start, java.time.OffsetDateTime end);

    List<Transaction> findByStatusOrderByAmountDesc(TransactionStatus status, Pageable pageable);
}
