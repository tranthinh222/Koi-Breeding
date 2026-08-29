package com.koibreeding.dto.response;

import java.math.BigDecimal;
import java.time.Instant;

import com.koibreeding.enums.PhTrend;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResPondDTO {
    private Integer id;
    private PondOwner owner;
    private String name;
    private Integer level;
    private Integer capacity;
    private Integer currentQuantity;
    private BigDecimal waterQuality;
    private BigDecimal temperature;
    private BigDecimal pH;
    private BigDecimal oxygen;
    private PhTrend phTrend;
    private Integer environmentScore;
    private BigDecimal environmentCoefficient;
    private Instant createdAt;
    private String description;

    @Getter
    @Setter
    public static class PondOwner {
        private Integer id;
        private String username;
    }
}
