package com.koibreeding.repository;

import java.util.Optional;
import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;

import com.koibreeding.domain.Payment;
import com.koibreeding.enums.PaymentStatus;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    Optional<Payment> findByOrderCode(Long orderCode);

    Optional<Payment> findBySepayTransactionId(Long sepayTransactionId);

    long countByStatusAndPaidAtBetween(PaymentStatus status, LocalDateTime start, LocalDateTime end);
}
