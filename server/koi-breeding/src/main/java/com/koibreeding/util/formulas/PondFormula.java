package com.koibreeding.util.formulas;

import java.math.BigDecimal;
import java.math.RoundingMode;

import com.koibreeding.domain.Pond;

public class PondFormula {
    private static final BigDecimal wPH = BigDecimal.valueOf(0.2);
    private static final BigDecimal wTemperature = BigDecimal.valueOf(0.15);
    private static final BigDecimal wWaterQuality = BigDecimal.valueOf(0.35);
    private static final BigDecimal wOxygen = BigDecimal.valueOf(0.3);

    private static final BigDecimal[] pHList = {
            BigDecimal.valueOf(6.0),
            BigDecimal.valueOf(6.5),
            BigDecimal.valueOf(6.8),
            BigDecimal.valueOf(7.0),
            BigDecimal.valueOf(7.5),
            BigDecimal.valueOf(8.0),
            BigDecimal.valueOf(8.5),
            BigDecimal.valueOf(9.0),
    };

    private static final BigDecimal[] temperatureList = {
            BigDecimal.valueOf(10.0),
            BigDecimal.valueOf(15.0),
            BigDecimal.valueOf(20.0),
            BigDecimal.valueOf(22.0),
            BigDecimal.valueOf(26.0),
            BigDecimal.valueOf(28.0),
            BigDecimal.valueOf(30.0),
            BigDecimal.valueOf(32.0),
    };

    private static final BigDecimal[] dissolvedOxygenList = {
            BigDecimal.valueOf(3.0),
            BigDecimal.valueOf(4.0),
            BigDecimal.valueOf(5.0),
            BigDecimal.valueOf(6.0),
            BigDecimal.valueOf(9.0),
            BigDecimal.valueOf(10.0),
            BigDecimal.valueOf(12.0),
    };

    public static int getPHScore(BigDecimal pH) {
        if (pH.compareTo(pHList[0]) < 0 || pH.compareTo(pHList[7]) > 0) {
            return 0;
        }

        if ((pH.compareTo(pHList[0]) >= 0 && pH.compareTo(pHList[1]) < 0)
                || (pH.compareTo(pHList[6]) > 0 && pH.compareTo(pHList[7]) <= 0)) {
            return 20;
        }

        if (pH.compareTo(pHList[1]) >= 0 && pH.compareTo(pHList[2]) < 0) {
            return 50;
        }

        if (pH.compareTo(pHList[5]) > 0 && pH.compareTo(pHList[6]) <= 0) {
            return 60;
        }

        if (pH.compareTo(pHList[2]) >= 0 && pH.compareTo(pHList[3]) < 0) {
            return 80;
        }

        if (pH.compareTo(pHList[4]) > 0 && pH.compareTo(pHList[5]) <= 0) {
            return 90;
        }

        return 100;
    }

    public static int getTemperatureScore(BigDecimal temperature) {
        if (temperature.compareTo(temperatureList[0]) < 0 || temperature.compareTo(temperatureList[7]) > 0) {
            return 0;
        }

        if (temperature.compareTo(temperatureList[0]) >= 0 && temperature.compareTo(temperatureList[1]) < 0) {
            return 20;
        }

        if (temperature.compareTo(temperatureList[6]) > 0 && temperature.compareTo(temperatureList[7]) <= 0) {
            return 40;
        }

        if (temperature.compareTo(temperatureList[1]) >= 0 && temperature.compareTo(temperatureList[2]) < 0) {
            return 50;
        }

        if (temperature.compareTo(temperatureList[5]) > 0 && temperature.compareTo(temperatureList[6]) <= 0) {
            return 70;
        }

        if (temperature.compareTo(temperatureList[2]) >= 0 && temperature.compareTo(temperatureList[3]) < 0) {
            return 80;
        }

        if (temperature.compareTo(temperatureList[4]) > 0 && temperature.compareTo(temperatureList[5]) <= 0) {
            return 90;
        }

        return 100;
    }

    public static int getOxygenScore(BigDecimal oxygen) {
        if (oxygen.compareTo(dissolvedOxygenList[0]) < 0) {
            return 0;
        }

        if (oxygen.compareTo(dissolvedOxygenList[0]) >= 0 && oxygen.compareTo(dissolvedOxygenList[1]) < 0) {
            return 20;
        }

        if ((oxygen.compareTo(dissolvedOxygenList[1]) >= 0 && oxygen.compareTo(dissolvedOxygenList[2]) < 0)
                || oxygen.compareTo(dissolvedOxygenList[6]) > 0) {
            return 50;
        }

        if (oxygen.compareTo(dissolvedOxygenList[5]) > 0 && oxygen.compareTo(dissolvedOxygenList[6]) <= 0) {
            return 70;
        }

        if (oxygen.compareTo(dissolvedOxygenList[2]) >= 0 && oxygen.compareTo(dissolvedOxygenList[3]) < 0) {
            return 80;
        }

        if (oxygen.compareTo(dissolvedOxygenList[4]) > 0 && oxygen.compareTo(temperatureList[5]) <= 0) {
            return 90;
        }

        return 100;
    }

    public static int getWaterQualityScore(int waterQuality) {
        if (0 <= waterQuality && waterQuality <= 20) {
            return 20;
        }

        if (20 < waterQuality && waterQuality <= 40) {
            return 40;
        }

        if (40 < waterQuality && waterQuality <= 60) {
            return 60;
        }

        if (60 < waterQuality && waterQuality <= 80) {
            return 80;
        }

        return 100;
    }

    public static int getEnvironmentQualityScore(BigDecimal pH, BigDecimal temperature, BigDecimal oxygen,
            int waterQuality) {
        BigDecimal phScore = BigDecimal.valueOf(getPHScore(pH));
        BigDecimal temperatureScore = BigDecimal.valueOf(getTemperatureScore(temperature));
        BigDecimal oxygenScore = BigDecimal.valueOf(getOxygenScore(oxygen));
        BigDecimal waterQualityScore = BigDecimal.valueOf(getWaterQualityScore(waterQuality));
        BigDecimal op1 = wPH.multiply(phScore);
        BigDecimal op2 = wTemperature.multiply(temperatureScore);
        BigDecimal op3 = wWaterQuality.multiply(waterQualityScore);
        BigDecimal op4 = wOxygen.multiply(oxygenScore);

        return op1.add(op2).add(op3).add(op4).setScale(0, RoundingMode.HALF_UP).intValue();
    }

    public static Pond generateAPond() {
        return new Pond();
    }
}
