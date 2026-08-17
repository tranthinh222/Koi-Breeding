package com.koibreeding.dto.response;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ResPurchaseDto {
    private ResTransactionDto transaction;
    private BigDecimal balance;
}
