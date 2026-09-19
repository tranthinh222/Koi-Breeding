package com.koibreeding.service;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import com.koibreeding.config.KoiCareConfig;
import com.koibreeding.domain.Koi;
import com.koibreeding.domain.Pond;
import com.koibreeding.enums.LifeStage;
import com.koibreeding.repository.KoiRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;

class KoiCareServiceTest {
    private final OffsetDateTime start = OffsetDateTime.parse("2026-09-18T00:00:00Z");
    private KoiCareService service;
    private Koi koi;

    @BeforeEach
    void setUp() {
        service = new KoiCareService(mock(KoiRepository.class), new KoiCareConfig(), mock(jakarta.persistence.EntityManager.class));
        Pond pond = new Pond();
        pond.setPH(new BigDecimal("7"));
        pond.setTemperature(new BigDecimal("25"));
        pond.setOxygen(new BigDecimal("6.8"));
        pond.setWaterQuality(new BigDecimal("100"));
        koi = new Koi();
        koi.setLifeStage(LifeStage.ADULT);
        koi.setPond(pond);
        koi.setLastCareUpdateAt(start);
    }

    @Test
    void foodDecaysOnlyForWholeHoursWithoutRepeatedDamage() {
        service.updateStats(koi, start.plusMinutes(59));
        assertEquals(100, koi.getFoodBar());
        service.updateStats(koi, start.plusMinutes(150));
        assertEquals(90, koi.getFoodBar());
        assertEquals(100, koi.getHealth());
        assertEquals(start.plusHours(2), koi.getLastCareUpdateAt());
        service.updateStats(koi, start.plusMinutes(150));
        assertEquals(90, koi.getFoodBar());
    }

    @Test
    void lowFoodCausesMildHealthLoss() {
        koi.setFoodBar(25);
        service.updateStats(koi, start.plusHours(1));
        assertEquals(20, koi.getFoodBar());
        assertEquals(99, koi.getHealth());
    }

    @Test
    void starvationWaitsTwoHoursAfterFoodReachesZero() {
        koi.setFoodBar(5);
        service.updateStats(koi, start.plusHours(2));
        assertEquals(0, koi.getFoodBar());
        assertEquals(start.plusHours(1), koi.getHungrySince());
        assertEquals(100, koi.getHealth());
        service.updateStats(koi, start.plusHours(3));
        assertEquals(97, koi.getHealth());
        service.updateStats(koi, start.plusHours(4));
        assertEquals(94, koi.getHealth());
    }

    @Test
    void environmentDamageUsesPondAlertThresholds() {
        koi.getPond().setWaterQuality(new BigDecimal("40"));
        service.updateStats(koi, start.plusHours(1));
        assertEquals(99, koi.getHealth());
        koi.getPond().setOxygen(new BigDecimal("3"));
        service.updateStats(koi, start.plusHours(2));
        assertEquals(96, koi.getHealth());
    }

    @Test
    void damageStacksAndHealthNeverDropsBelowZero() {
        koi.setFoodBar(0);
        koi.setHungrySince(start.minusHours(2));
        koi.getPond().setWaterQuality(BigDecimal.ZERO);
        koi.setHealth(10);
        service.updateStats(koi, start.plusHours(1));
        assertEquals(4, koi.getHealth());
        service.updateStats(koi, start.plusHours(100));
        assertEquals(0, koi.getHealth());
    }

    @Test
    void legacyFishStartCareClockWithoutRetroactiveDamage() {
        koi.setLastCareUpdateAt(null);
        koi.setFoodBar(0);
        service.updateStats(koi, start);
        assertEquals(100, koi.getHealth());
        assertEquals(start, koi.getLastCareUpdateAt());
        assertEquals(start, koi.getHungrySince());
    }

    @Test
    void eggsDoNotStarve() {
        koi.setLifeStage(LifeStage.EGG);
        service.updateStats(koi, start.plusDays(3));
        assertEquals(100, koi.getFoodBar());
        assertEquals(100, koi.getHealth());
    }
}
