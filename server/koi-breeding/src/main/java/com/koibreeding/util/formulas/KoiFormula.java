package com.koibreeding.util.formulas;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Random;

import org.springframework.stereotype.Component;

import com.koibreeding.domain.Dictionary;
import com.koibreeding.domain.Koi;
import com.koibreeding.domain.Mutation;
import com.koibreeding.domain.Pond;
import com.koibreeding.enums.Gender;
import com.koibreeding.enums.LifeStage;
import com.koibreeding.enums.Shape;

@Component
public class KoiFormula {
    private final Random random = new Random();
    private final PondFormula pondFormula;

    public KoiFormula(PondFormula pondFormula) {
        this.pondFormula = pondFormula;
    }

    private double generateGaussianInRange(double min, double max) {
        double mean = (min + max) / 2.0;
        double stdDev = (max - min) / 6.0;

        double val;
        do {
            val = mean + (random.nextGaussian() * stdDev);
        } while (val < min || val > max); // Remove cases that exceed the allowed range

        return val;
    }

    public LifeStage defineLifeStage(int age) {
        if (0 <= age && age <= 3) {
            return LifeStage.EGG;
        }

        if (age > 3 && age <= 10) {
            return LifeStage.LARVA;
        }

        if (age > 10 && age <= 30) {
            return LifeStage.FRY;
        }

        if (age > 30 && age < 6 * 30) {
            return LifeStage.JUVENILE;
        }

        return LifeStage.ADULT;
    }

    public BigDecimal generateRandomPotential() {
        return BigDecimal.valueOf(generateGaussianInRange(0.85, 1.3));
    }

    public BigDecimal calculateKoiLength(int age, int health, int foodBar, BigDecimal potential,
            Mutation mutation,
            Dictionary dictionary, Pond pond) {
        // Egg size vary from 1.2 - 2.0 mm
        if (defineLifeStage(age).equals(LifeStage.EGG)) {
            return BigDecimal.valueOf(generateGaussianInRange(0.12, 0.2)).setScale(2, RoundingMode.HALF_UP);
        }

        // Larva_Length = 10 * BaseGrowthRate * (age + 1)
        if (defineLifeStage(age).equals(LifeStage.LARVA)) {
            return BigDecimal.valueOf(calculateLarvaLength(age, dictionary)).setScale(2,
                    RoundingMode.HALF_UP);
        }

        // Fry_length = Larva_length(10) * e ^ (4 * BaseGrowthRate * (age - 10))
        if (defineLifeStage(age).equals(LifeStage.FRY)) {
            return BigDecimal
                    .valueOf(calculateFryLength(age, dictionary))
                    .setScale(2, RoundingMode.HALF_UP);
        }

        /**
         * Juvenile & Adult
         * Max_Length_effective = BaseMaxLength * PotentialModifier * MutationModifier
         * k_effective = BaseGrowthRate * EnvironmentModifier * NutritionModifier *
         * CureModifier * HealthModifier
         * Length(age) = (Max_Length_effective) / (1 + e ^ (-k_effective * (age -
         * Mid_Age)))
         * Normalized_Length(age) = (Length(age) - Length(30)) / (1 - Length(30))
         * CurrentLength(age) = Fry_Length(30) + (Max_Length_effective - Fry_Length(30))
         * * Normalized_Length(age)
         */

        double baseMaxLength = dictionary.getBaseMaxLength().doubleValue();
        double potentialModifier = potential.doubleValue();
        double mutationModifier = mutation != null ? mutation.getValue().doubleValue() : 1.0;
        double baseGrowthRate = dictionary.getBaseGrowthRate().doubleValue();
        double environmentModifier = pond != null ? 0.8
                + (pondFormula.getEnvironmentScore(pond.getPH(), pond.getTemperature(), pond.getWaterQuality(),
                        pond.getOxygen()) / 100.0)
                        * 0.4
                : 1.0;
        double nutritionModifier = 0.85 + (foodBar / 100.0) * 0.3;
        double healthModifier = 0.5 + (health / 100.0) * 0.5;
        int midAge = dictionary.getMidAge();

        double maxLengthEffective = baseMaxLength * potentialModifier * mutationModifier;
        double kEffective = baseGrowthRate * environmentModifier * nutritionModifier * healthModifier;
        double lengthAge = calculateLength(maxLengthEffective, kEffective, age, midAge);
        double fryLength30 = calculateFryLength(30, dictionary);
        double length30 = calculateLength(maxLengthEffective, kEffective, 30, midAge);
        double normalizedLengthAge = (lengthAge - length30) / (1 - length30);
        double currentLengthAge = fryLength30 + (maxLengthEffective - fryLength30) * normalizedLengthAge;

        return BigDecimal.valueOf(currentLengthAge).setScale(2, RoundingMode.HALF_UP);
    }

    private double calculateLarvaLength(int age, Dictionary dictionary) {
        return 10 * dictionary.getBaseGrowthRate().doubleValue() * (age + 1);
    }

    private double calculateFryLength(int age, Dictionary dictionary) {
        double larvaLength10 = calculateLarvaLength(10, dictionary);
        return larvaLength10 * Math.exp(4 * dictionary.getBaseGrowthRate().doubleValue() * (age - 10));
    }

    private double calculateLength(double maxLengthEffective, double kEffective, int age, int midAge) {
        return maxLengthEffective / (1 + Math.exp(-kEffective * (age - midAge)));
    }

    public BigDecimal calculateKoiWeight(double length, BigDecimal potential, int foodBar, int health, Pond pond,
            Dictionary dictionary) {
        double alpha = dictionary.getAlphaWeight().doubleValue();
        double beta = generateGaussianInRange(2.95, 3.0);
        double bodyTypeModifier = dictionary.getShape().equals(Shape.STANDARD) ? 1.0 : 0.94;
        double potentialModifier = potential.doubleValue();
        double environmentModifier = (pond != null) ? 0.8
                + (pondFormula.getEnvironmentScore(pond.getPH(), pond.getTemperature(), pond.getWaterQuality(),
                        pond.getOxygen()) / 100.0)
                        * 0.4
                : 1.0;
        double nutritionModifier = 0.85 + (foodBar / 100.0) * 0.3;
        double healthModifier = 0.5 + (health / 100.0) * 0.5;

        double bodyCondition = potentialModifier * environmentModifier * nutritionModifier * healthModifier;

        return BigDecimal.valueOf(alpha * Math.pow(length, beta) * bodyTypeModifier * bodyCondition).setScale(2,
                RoundingMode.HALF_UP);
    }

    public int calculateKoiPrice(int age, double length, int patternScore, int colorScore, int bodyScore,
            int skinScore, int scaleScore, int health, Mutation mutation, Dictionary dictionary) {
        int midAge = dictionary.getMidAge();
        int basePrice = dictionary.getBasePrice();
        double alpha = dictionary.getAlphaPrice().doubleValue();
        double lengthBase = 10.0;
        double beautyScore = 0.35 * patternScore + 0.25 * colorScore + 0.2 * bodyScore + 0.1 * skinScore
                + 0.1 * scaleScore;
        double beautyModifier = 1.2 * (beautyScore / 100.0) + 0.8;
        double qualityModifier = 0.4 * (health / 100.0) + 0.8;
        double ageModifier = calculateAgeModifier(age, midAge);
        double mutationModifier = mutation != null ? mutation.getValue().doubleValue() : 1.0;
        double varience = generateGaussianInRange(0.95, 1.05);

        double price = basePrice * Math.pow((length / lengthBase), alpha) * beautyModifier * qualityModifier
                * ageModifier * mutationModifier * varience;
        return BigDecimal.valueOf(price).setScale(0, RoundingMode.HALF_UP).intValue();

    }

    private double calculateAgeModifier(int age, int midAge) {
        double ageModifier = 0.9 + (1.1 - 0.9) * Math.exp(-Math.pow((age - midAge) / 365.0, 2) / (2 * Math.pow(2, 2)));

        if (ageModifier < 0.9) {
            return 0.9;
        }

        if (ageModifier > 1.1) {
            return 1.1;
        }

        return ageModifier;
    }

    public Koi generateStarterKoi(Dictionary dictionary, Pond pond) {
        Koi koi = new Koi();

        int age = 50;
        int health = (int) generateGaussianInRange(80, 100);
        int foodBar = (int) generateGaussianInRange(60, 80);
        BigDecimal potential = generateRandomPotential();
        int patternScore = (int) generateGaussianInRange(60.0, 100.0);
        int colorScore = (int) generateGaussianInRange(60.0, 100.0);
        int bodyScore = (int) generateGaussianInRange(60.0, 100.0);
        int skinScore = (int) generateGaussianInRange(60.0, 100.0);
        int scaleScore = (int) generateGaussianInRange(60.0, 100.0);
        BigDecimal length = calculateKoiLength(age, health, foodBar, potential, null, dictionary, pond);
        BigDecimal weight = calculateKoiWeight(length.doubleValue(), potential, foodBar, health, pond, dictionary);
        int price = calculateKoiPrice(age, length.doubleValue(), patternScore, colorScore, bodyScore, skinScore,
                scaleScore, health, null, dictionary);

        koi.setName(dictionary.getName());
        koi.setAge(age);
        koi.setLength(length);
        koi.setWeight(weight);
        koi.setHealth(health);
        koi.setFoodBar(foodBar);
        koi.setGender(generateGaussianInRange(-1.0, 1.0) < 0 ? Gender.MALE : Gender.FEMALE);
        koi.setPrice(price);
        koi.setPond(pond);
        koi.setLifeStage(defineLifeStage(age));
        koi.setPotential(potential);
        koi.setDictionary(dictionary);
        koi.setPatternScore(patternScore);
        koi.setColorScore(colorScore);
        koi.setBodyScore(bodyScore);
        koi.setSkinScore(skinScore);
        koi.setScaleScore(scaleScore);

        return koi;
    }
}
