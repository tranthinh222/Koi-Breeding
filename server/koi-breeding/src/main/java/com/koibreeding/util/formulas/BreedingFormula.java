package com.koibreeding.util.formulas;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Random;

import org.springframework.stereotype.Component;

import com.koibreeding.domain.Koi;
import com.koibreeding.domain.Pond;
import com.koibreeding.enums.BreedingType;

@Component
public class BreedingFormula {
    private final Integer baseTime = 1; // In hour
    private final Integer maxTime = 24;
    private final Integer maxEgg = 5;
    private final Random random = new Random();
    private final PondFormula pondFormula;

    public BreedingFormula(PondFormula pondFormula) {
        this.pondFormula = pondFormula;
    }

    private double translatePotential(BigDecimal potential) {
        double potentialVal = potential.doubleValue();
        return 20.0 * potentialVal / 9.0 - 17.0 / 9.0;
    }

    public BigDecimal calculateBreedScore(Koi father, Koi mother, Pond isolatedPond) {

        double avgHealth = (father.getHealth() + mother.getHealth()) / 200.0;
        double environment = pondFormula.getEnvironmentScore(isolatedPond.getPH(), isolatedPond.getTemperature(),
                isolatedPond.getWaterQuality(), isolatedPond.getOxygen()) / 100.0;
        double avgPotential = (translatePotential(father.getPotential()) + translatePotential(mother.getPotential()))
                / 2.0;
        double avgWeight = (father.getWeight().doubleValue() + mother.getWeight().doubleValue()) / 20.0;
        double avgLength = (father.getLength().doubleValue() + mother.getLength().doubleValue()) / 160.0;

        BigDecimal breedScore = BigDecimal.valueOf(
                0.35 * avgHealth + 0.3 * environment + 0.2 * avgPotential + 0.1 * avgWeight + 0.05 * avgLength)
                .setScale(2, RoundingMode.HALF_UP);

        if (breedScore.doubleValue() > 1.0) {
            return BigDecimal.valueOf(1.0);
        }

        return breedScore;
    }

    public BigDecimal calculateBreedTime(BigDecimal breedScore) {
        return BigDecimal.valueOf(this.baseTime + (this.maxTime - this.baseTime) * breedScore.doubleValue()).setScale(2,
                RoundingMode.HALF_UP);
    }

    public int calculateLaidEggs(BigDecimal breedScore, BreedingType breedingType) {
        if (breedingType.equals(BreedingType.MANUAL)) {
            return (int) (maxEgg - (maxEgg - 1) * breedScore.doubleValue());
        }

        return random.nextInt(2) + 1;
    }
}
