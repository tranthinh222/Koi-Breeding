package com.koibreeding.util.formulas;

import java.util.Arrays;

import org.springframework.stereotype.Component;

@Component
public class LevelingSystem {
    private final int USER_MAX_LEVEL = 30;
    private final int POND_MAX_LEVEL = 20;
    private final int[] userLevelRequiredExp = { 0, 50, 100, 180, 300, 500, 800, 1200, 1650, 2100, 2600, 3150, 3800,
            4600,
            6250, 8500, 10250, 13500, 16300, 20000, 23250, 26400, 29050, 32600, 35900, 38950, 41600, 43750, 46250,
            50000 };

    private final int[] pondLevelRequiredKoins = { 0, 50, 100, 150, 200, 250, 300, 400, 550, 750, 900, 1100, 1350, 1750,
            2000, 2500, 3250, 4500, 7500, 10000 };

    public int getUserMaxLevel() {
        return USER_MAX_LEVEL;
    }

    public int getPondMaxLevel() {
        return POND_MAX_LEVEL;
    }

    public int getUserLevel(int exp) {
        int currentExp = 0;
        for (int i = 0; i < userLevelRequiredExp.length; ++i) {
            currentExp += userLevelRequiredExp[i];
            if (exp == currentExp) {
                return i + 1;
            }
            if (exp < currentExp) {
                return i;
            }
        }

        return 30;
    }

    public int getLevelRequiredExp(int level) {
        return userLevelRequiredExp[level - 1];
    }

    public int getUserCurrentExp(int exp) {
        if (exp >= Arrays.stream(userLevelRequiredExp).sum()) {
            return userLevelRequiredExp[userLevelRequiredExp.length - 1];
        }

        int currentExp = 0;
        for (int i = 0; i < userLevelRequiredExp.length; ++i) {
            currentExp += userLevelRequiredExp[i];
            if (exp == currentExp) {
                currentExp = 0;
                break;
            }
            if (exp < currentExp) {
                currentExp = exp - (currentExp - userLevelRequiredExp[i]);
                break;
            }
        }

        return currentExp;
    }

    public int getPondNextLevelPrice(int level) {
        if (level == 20) {
            return 0;
        }

        return pondLevelRequiredKoins[level];
    }
}
