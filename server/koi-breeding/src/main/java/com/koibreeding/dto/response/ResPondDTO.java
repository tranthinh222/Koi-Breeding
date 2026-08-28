package com.koibreeding.dto.response;

import java.math.BigDecimal;
import java.time.Instant;

import lombok.Getter;
import lombok.Setter;
import com.koibreeding.enums.PhTrend;

@Getter
@Setter
public class ResPondDTO {
    private Integer id;
    private PondOwner owner;
    private String name;
    private Integer level;
    private Integer capacity;
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
