package com.koibreeding.dto.request;

import lombok.*;

import java.math.BigDecimal;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResMarketSellKoi {
    Integer koiId;
    Long price;
}
