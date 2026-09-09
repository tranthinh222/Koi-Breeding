package com.koibreeding.dto.request;

import java.math.BigDecimal;

import com.koibreeding.enums.Gender;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResMarketListKoi {
    Integer koiId;
    Integer pondId;
    String pondName;
    String koiName;
    String breed;
    Gender gender;
    BigDecimal weight;
    BigDecimal length;
    String imageUrl;
    Integer price;
}
