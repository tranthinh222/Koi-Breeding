package com.koibreeding.domain;

import java.time.LocalDateTime;

import com.koibreeding.enums.PaymentStatus;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "payment", indexes = {
        @Index(name = "idx_payment_order_code", columnList = "order_code"),
        @Index(name = "idx_payment_user_id", columnList = "user_id")
})
@Getter
@Setter
@NoArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @Column(name = "order_code", nullable = false, unique = true)
    private Long orderCode;

    @Column(nullable = false)
    private Long amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    /**
     * SePay transaction id. Used to make webhook processing idempotent.
     */
    @Column(name = "sepay_transaction_id", unique = true)
    private Long sepayTransactionId;
}