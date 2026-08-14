package com.koibreeding.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.koibreeding.domain.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    Optional<Payment> findByOrderCode(Long orderCode);

    Optional<Payment> findBySepayTransactionId(Long sepayTransactionId);
}
