package com.koibreeding.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ResCreatePaymentDto{
        Integer paymentId;
        Long orderCode;
        Long amount;
        String qrUrl;
        String status;
}