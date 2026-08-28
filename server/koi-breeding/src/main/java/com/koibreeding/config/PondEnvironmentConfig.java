package com.koibreeding.config;

import java.math.BigDecimal;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "app.pond.environment")
public class PondEnvironmentConfig {
    private BigDecimal phWeight;
    private BigDecimal temperatureWeight;
    private BigDecimal waterWeight;
    private BigDecimal oxygenWeight;
    private BigDecimal coefficientMin;
    private BigDecimal coefficientRange;
    private BigDecimal temperatureResponseRate;
    private Integer waterQualityDecreaseMinTenths;
    private Integer waterQualityDecreaseMaxTenths;
    private Integer oxygenDecreaseMinTenths;
    private Integer oxygenDecreaseMaxTenths;
    private Integer phChangeMinTenths;
    private Integer phChangeMaxTenths;
    private Integer phTrendDurationDays;
    private BigDecimal treatmentTemperatureChange;
    private Integer treatmentDurationHours;
    private Integer locationChangeCooldownDays;
}
