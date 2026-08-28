package com.koibreeding.util.formulas;

import java.math.BigDecimal;
import java.math.RoundingMode;

import org.springframework.stereotype.Component;

import com.koibreeding.config.PondEnvironmentConfig;

@Component
public class PondFormula {
    private final PondEnvironmentConfig config;

    public PondFormula(PondEnvironmentConfig config) {
        this.config = config;
    }

    public static int getPHScore(BigDecimal value) {
        requireValue(value, "pH");
        double pH = value.doubleValue();
        if (pH < 6 || pH > 9)
            return 0;
        if (pH < 6.5 || pH > 8.5)
            return 20;
        if (pH < 6.8)
            return 50;
        if (pH > 8)
            return 60;
        if (pH < 7)
            return 80;
        if (pH > 7.5)
            return 90;
        return 100;
    }

    public static int getTemperatureScore(BigDecimal value) {
        requireValue(value, "temperature");
        double temperature = value.doubleValue();
        if (temperature < 10 || temperature > 32)
            return 0;
        if (temperature < 15)
            return 20;
        if (temperature < 20)
            return 50;
        if (temperature < 22)
            return 80;
        if (temperature <= 26)
            return 100;
        if (temperature <= 28)
            return 90;
        if (temperature <= 30)
            return 70;
        return 40;
    }

    public static int getWaterScore(BigDecimal waterQuality) {
        requireValue(waterQuality, "waterQuality");
        if (waterQuality.compareTo(BigDecimal.ZERO) < 0 || waterQuality.compareTo(BigDecimal.valueOf(100)) > 0) {
            throw new IllegalArgumentException("waterQuality must be between 0 and 100");
        }
        if (waterQuality.compareTo(BigDecimal.valueOf(20)) <= 0)
            return 20;
        if (waterQuality.compareTo(BigDecimal.valueOf(40)) <= 0)
            return 40;
        if (waterQuality.compareTo(BigDecimal.valueOf(60)) <= 0)
            return 60;
        if (waterQuality.compareTo(BigDecimal.valueOf(80)) <= 0)
            return 80;
        return 100;
    }

    public static int getOxygenScore(BigDecimal value) {
        requireValue(value, "oxygen");
        double oxygen = value.doubleValue();
        if (oxygen < 3)
            return 0;
        if (oxygen < 4)
            return 20;
        if (oxygen < 5)
            return 50;
        if (oxygen < 6)
            return 80;
        if (oxygen <= 9)
            return 100;
        if (oxygen <= 10)
            return 90;
        if (oxygen <= 12)
            return 70;
        return 50;
    }

    public int getEnvironmentScore(BigDecimal pH, BigDecimal temperature, BigDecimal waterQuality,
            BigDecimal oxygen) {
        BigDecimal score = config.getPhWeight().multiply(BigDecimal.valueOf(getPHScore(pH)))
                .add(config.getTemperatureWeight().multiply(BigDecimal.valueOf(getTemperatureScore(temperature))))
                .add(config.getWaterWeight().multiply(BigDecimal.valueOf(getWaterScore(waterQuality))))
                .add(config.getOxygenWeight().multiply(BigDecimal.valueOf(getOxygenScore(oxygen))));
        return score.setScale(0, RoundingMode.HALF_UP).intValue();
    }

    public BigDecimal getEnvironmentCoefficient(int score) {
        if (score < 0 || score > 100) {
            throw new IllegalArgumentException("score must be between 0 and 100");
        }
        return config.getCoefficientMin()
                .add(BigDecimal.valueOf(score).divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP)
                        .multiply(config.getCoefficientRange()))
                .setScale(3, RoundingMode.HALF_UP);
    }

    private static void requireValue(BigDecimal value, String name) {
        if (value == null)
            throw new IllegalArgumentException(name + " must not be null");
    }
}
