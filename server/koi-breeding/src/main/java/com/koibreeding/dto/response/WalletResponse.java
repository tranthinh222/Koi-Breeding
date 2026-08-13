package com.koibreeding.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class WalletResponse {
    private BigDecimal balance;

    public WalletResponse(
            BigDecimal balance
    ){
        this.balance = balance;
    }

}
