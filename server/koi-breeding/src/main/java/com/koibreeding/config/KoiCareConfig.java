package com.koibreeding.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.koi.care")
@Getter
@Setter
public class KoiCareConfig {
    private int foodLossPerHour = 5;
    private int lowFoodThreshold = 20;
    private int lowFoodDamage = 1;
    private int starvationGraceHours = 2;
    private int starvationDamage = 3;
    private int environmentWarningDamage = 1;
    private int environmentCriticalDamage = 3;
}
