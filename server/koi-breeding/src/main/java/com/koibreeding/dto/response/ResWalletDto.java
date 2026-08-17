package com.koibreeding.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ResWalletDto {
    private BigDecimal balance;

    public ResWalletDto(
            BigDecimal balance) {
        this.balance = balance;
    }

}
