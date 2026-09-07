package com.koibreeding.util.formulas;

import org.springframework.stereotype.Component;

@Component
public class LevelingSystem {
    private final int USER_MAX_LEVEL = 30;
    private final int POND_MAX_LEVEL = 20;
    private final int[] pondLevelRequiredKoins = { 0, 50, 100, 150, 200, 250, 300, 400, 550, 750, 900, 1100, 1350, 1750,
            2000, 2500, 3250, 4500, 7500, 10000 };

    public int getUserMaxLevel() {
        return USER_MAX_LEVEL;
    }

    public int getPondMaxLevel() {
        return POND_MAX_LEVEL;
    }

    public int getPondNextLevelPrice(int level) {
        if (level == 20) {
            return 0;
        }

        return pondLevelRequiredKoins[level];
    }
}
