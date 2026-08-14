package com.koibreeding.dto.response;

public record ResCreatePaymentDto(
        Integer paymentId,
        Long orderCode,
        Long amount,
        String qrUrl,
        String status) {
}