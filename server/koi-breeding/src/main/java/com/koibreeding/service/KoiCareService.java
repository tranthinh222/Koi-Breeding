package com.koibreeding.service;

import java.time.OffsetDateTime;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import java.time.temporal.ChronoUnit;
import com.koibreeding.config.KoiCareConfig;
import com.koibreeding.domain.Koi;
import com.koibreeding.domain.Pond;
import com.koibreeding.enums.LifeStage;
import com.koibreeding.repository.KoiRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class KoiCareService {
    private final KoiRepository koiRepository;
    private final KoiCareConfig config;
    private final EntityManager entityManager;

    @Transactional
    public void updateKoi(Integer id, OffsetDateTime now) {
        koiRepository.findById(id).ifPresent(koi -> {
            entityManager.refresh(koi, LockModeType.PESSIMISTIC_WRITE);
            updateStats(koi, now);
        });
    }

    // Called while holding the koi row lock, including before feeding and healing.
    public void updateStats(Koi koi, OffsetDateTime now) {
        if (koi.getLastCareUpdateAt() == null || koi.getLifeStage() == LifeStage.EGG) {
            koi.setLastCareUpdateAt(now);
            koi.setHungrySince(koi.getFoodBar() == 0 && koi.getLifeStage() != LifeStage.EGG ? now : null);
            return;
        }
        if (koi.getFoodBar() == 0 && koi.getHungrySince() == null) {
            koi.setHungrySince(koi.getLastCareUpdateAt());
        }
        long hours = ChronoUnit.HOURS.between(koi.getLastCareUpdateAt(), now);
        if (hours <= 0) return;
        int environmentDamage = environmentDamage(koi.getPond());
        for (long hour = 0; hour < hours; hour++) {
            OffsetDateTime tick = koi.getLastCareUpdateAt().plusHours(1);
            int food = Math.max(0, koi.getFoodBar() - Math.max(0, config.getFoodLossPerHour()));
            koi.setFoodBar(food);
            if (food > 0) koi.setHungrySince(null);
            else if (koi.getHungrySince() == null) koi.setHungrySince(tick);

            int damage = environmentDamage;
            if (food == 0) {
                if (!tick.isBefore(koi.getHungrySince().plusHours(Math.max(0, config.getStarvationGraceHours())))) {
                    damage += Math.max(0, config.getStarvationDamage());
                }
            } else if (food <= config.getLowFoodThreshold()) {
                damage += Math.max(0, config.getLowFoodDamage());
            }
            koi.setHealth(Math.max(0, koi.getHealth() - damage));
            koi.setLastCareUpdateAt(tick);
        }
    }

    private int environmentDamage(Pond pond) {
        double ph = pond.getPH().doubleValue();
        double temperature = pond.getTemperature().doubleValue();
        double oxygen = pond.getOxygen().doubleValue();
        double water = pond.getWaterQuality().doubleValue();
        if (ph < 6.5 || ph > 8.5 || temperature < 15 || temperature > 30
                || oxygen < 4 || oxygen > 12 || water <= 20) {
            return Math.max(0, config.getEnvironmentCriticalDamage());
        }
        if (ph < 6.8 || ph > 8 || temperature < 20 || temperature > 28
                || oxygen < 5 || oxygen > 10 || water <= 40) {
            return Math.max(0, config.getEnvironmentWarningDamage());
        }
        return 0;
    }
}
