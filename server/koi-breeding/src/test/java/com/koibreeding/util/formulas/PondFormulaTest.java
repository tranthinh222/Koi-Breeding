package com.koibreeding.util.formulas;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.math.BigDecimal;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import com.koibreeding.config.PondEnvironmentConfig;

class PondFormulaTest {
    private PondFormula pondFormula;

    @BeforeEach
    void setUp() {
        PondEnvironmentConfig config = new PondEnvironmentConfig();
        config.setPhWeight(decimal("0.20"));
        config.setTemperatureWeight(decimal("0.15"));
        config.setWaterWeight(decimal("0.35"));
        config.setOxygenWeight(decimal("0.30"));
        config.setCoefficientMin(decimal("0.8"));
        config.setCoefficientRange(decimal("0.4"));
        pondFormula = new PondFormula(config);
    }
    private static BigDecimal decimal(String value) {
        return new BigDecimal(value);
    }

    @Test
    void scoresPhAtAllImportantBoundaries() {
        assertEquals(0, PondFormula.getPHScore(decimal("5.9")));
        assertEquals(20, PondFormula.getPHScore(decimal("6.0")));
        assertEquals(50, PondFormula.getPHScore(decimal("6.5")));
        assertEquals(80, PondFormula.getPHScore(decimal("6.8")));
        assertEquals(100, PondFormula.getPHScore(decimal("7.0")));
        assertEquals(100, PondFormula.getPHScore(decimal("7.5")));
        assertEquals(90, PondFormula.getPHScore(decimal("8.0")));
        assertEquals(60, PondFormula.getPHScore(decimal("8.5")));
        assertEquals(20, PondFormula.getPHScore(decimal("9.0")));
        assertEquals(0, PondFormula.getPHScore(decimal("9.1")));
    }

    @Test
    void scoresTemperatureAtAllBands() {
        int[] expected = {0, 20, 50, 80, 100, 90, 70, 40, 0};
        String[] values = {"9.9", "10", "15", "20", "22", "27", "29", "31", "32.1"};
        for (int i = 0; i < values.length; i++) {
            assertEquals(expected[i], PondFormula.getTemperatureScore(decimal(values[i])));
        }
    }

    @Test
    void scoresWaterAndOxygenAtAllBands() {
        assertEquals(20, PondFormula.getWaterScore(decimal("20")));
        assertEquals(40, PondFormula.getWaterScore(decimal("20.1")));
        assertEquals(60, PondFormula.getWaterScore(decimal("41")));
        assertEquals(80, PondFormula.getWaterScore(decimal("61")));
        assertEquals(100, PondFormula.getWaterScore(decimal("81")));

        assertEquals(0, PondFormula.getOxygenScore(decimal("2.9")));
        assertEquals(20, PondFormula.getOxygenScore(decimal("3")));
        assertEquals(50, PondFormula.getOxygenScore(decimal("4")));
        assertEquals(80, PondFormula.getOxygenScore(decimal("5")));
        assertEquals(100, PondFormula.getOxygenScore(decimal("6")));
        assertEquals(90, PondFormula.getOxygenScore(decimal("9.1")));
        assertEquals(70, PondFormula.getOxygenScore(decimal("10.1")));
        assertEquals(50, PondFormula.getOxygenScore(decimal("12.1")));
    }

    @Test
    void calculatesDocumentExampleAndCoefficient() {
        int score = pondFormula.getEnvironmentScore(decimal("7.2"), decimal("24"), decimal("75"), decimal("7"));
        assertEquals(93, score);
        assertEquals(decimal("1.172"), pondFormula.getEnvironmentCoefficient(score));
    }

    @Test
    void rejectsInvalidRawWaterQuality() {
        assertThrows(IllegalArgumentException.class, () -> PondFormula.getWaterScore(decimal("-0.1")));
        assertThrows(IllegalArgumentException.class, () -> PondFormula.getWaterScore(decimal("100.1")));
    }
}
