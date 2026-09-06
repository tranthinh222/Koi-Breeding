package com.koibreeding.dto.request;

import com.koibreeding.enums.Gender;
import lombok.*;

import java.math.BigDecimal;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResMarketListKoi {
    Integer koiId;
    Integer pondId;
    String koiName;
    String breed;
    Gender gender;
    BigDecimal weight;
    BigDecimal length;
    String imageUrl;
}
