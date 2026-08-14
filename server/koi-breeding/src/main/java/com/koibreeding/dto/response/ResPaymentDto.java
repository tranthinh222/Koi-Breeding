package com.koibreeding.dto.response;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResPaymentDto {
    private Integer paymentId;
    private Long orderCode;
    private Long amount;
    private String status;
}
