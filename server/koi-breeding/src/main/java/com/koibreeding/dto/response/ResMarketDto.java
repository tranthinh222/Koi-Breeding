package com.koibreeding.dto.response;

import com.koibreeding.enums.Gender;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResMarketDto {
    private Integer id;
    private String koiName;
    private Integer koiId;
    private String image;
    private Long price;
    private String description;
    private Integer sellerId;
    private String seller;
    private Gender gender;
    private BigDecimal weight;
    private BigDecimal length;
}
