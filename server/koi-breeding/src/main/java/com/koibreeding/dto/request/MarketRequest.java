package com.koibreeding.dto.request;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MarketRequest {
    String keyword;
    String category;
    BigDecimal minPrice;
    BigDecimal maxPrice;
    String size;
    String weight;
    String gender;
}
