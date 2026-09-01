package com.koibreeding.dto.response;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResBuyOrUpgradePondDTO {
    private ResPondDTO pond;
    private BigDecimal balance;
}
