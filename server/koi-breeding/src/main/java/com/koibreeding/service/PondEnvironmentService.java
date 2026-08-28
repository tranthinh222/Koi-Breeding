package com.koibreeding.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.koibreeding.config.PondEnvironmentConfig;
import com.koibreeding.domain.Pond;
import com.koibreeding.enums.PhTrend;
import com.koibreeding.repository.PondRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PondEnvironmentService {
    private final PondRepository pondRepository;
    private final WeatherService weatherService;
    private final PondEnvironmentConfig config;

    @Scheduled(cron = "${app.pond.daily-update-cron:0 5 0 * * *}", zone = "${app.time-zone:Asia/Ho_Chi_Minh}")
    @Transactional
    public void updateAllPondsDaily() {
        OffsetDateTime now = OffsetDateTime.now();
        for (Pond pond : pondRepository.findAll()) {
            if (pond.getLastEnvironmentUpdateAt() != null
                    && pond.getLastEnvironmentUpdateAt().toLocalDate().equals(now.toLocalDate())) {
                continue;
            }
            updatePond(pond, now);
        }
    }

    @Scheduled(fixedDelayString = "${app.pond.treatment-expiry-check-ms:60000}")
    @Transactional
    public void expireTemperatureTreatments() {
        OffsetDateTime now = OffsetDateTime.now();
        for (Pond pond : pondRepository.findAll()) {
            if (pond.getTemperatureAdjustmentExpiresAt() == null
                    || pond.getTemperatureAdjustmentExpiresAt().isAfter(now)) {
                continue;
            }
            BigDecimal adjustment = pond.getTemperatureAdjustment() == null
                    ? BigDecimal.ZERO
                    : pond.getTemperatureAdjustment();
            pond.setTemperature(pond.getTemperature().subtract(adjustment).setScale(1, RoundingMode.HALF_UP));
            pond.setTemperatureAdjustment(BigDecimal.ZERO);
            pond.setTemperatureAdjustmentExpiresAt(null);
            pondRepository.save(pond);
        }
    }

    void updatePond(Pond pond, OffsetDateTime now) {
        pond.setWaterQuality(pond.getWaterQuality().subtract(randomTenths(
                config.getWaterQualityDecreaseMinTenths(), config.getWaterQualityDecreaseMaxTenths()))
                .max(BigDecimal.ZERO)
                .setScale(1, RoundingMode.HALF_UP));
        pond.setOxygen(pond.getOxygen().subtract(randomTenths(
                config.getOxygenDecreaseMinTenths(), config.getOxygenDecreaseMaxTenths())).max(BigDecimal.ZERO)
                .setScale(2, RoundingMode.HALF_UP));

        if (pond.getPhTrendChangedAt() == null
                || ChronoUnit.DAYS.between(pond.getPhTrendChangedAt(), now) >= config.getPhTrendDurationDays()) {
            pond.setPhTrend(pond.getPhTrend() == PhTrend.ACIDIC ? PhTrend.ALKALINE : PhTrend.ACIDIC);
            pond.setPhTrendChangedAt(now);
        }
        BigDecimal phChange = randomTenths(config.getPhChangeMinTenths(), config.getPhChangeMaxTenths());
        BigDecimal newPh = pond.getPhTrend() == PhTrend.ACIDIC
                ? pond.getPH().subtract(phChange)
                : pond.getPH().add(phChange);
        pond.setPH(newPh.max(BigDecimal.ZERO).min(new BigDecimal("14.0")).setScale(1, RoundingMode.HALF_UP));

        updateTemperature(pond, now);
        pond.setLastEnvironmentUpdateAt(now);
        pondRepository.save(pond);
    }

    private void updateTemperature(Pond pond, OffsetDateTime now) {
        BigDecimal adjustment = pond.getTemperatureAdjustment() == null
                ? BigDecimal.ZERO
                : pond.getTemperatureAdjustment();
        BigDecimal oldBaseTemperature = pond.getTemperature().subtract(adjustment);
        boolean adjustmentActive = pond.getTemperatureAdjustmentExpiresAt() != null
                && pond.getTemperatureAdjustmentExpiresAt().isAfter(now);
        if (!adjustmentActive) {
            adjustment = BigDecimal.ZERO;
            pond.setTemperatureAdjustment(BigDecimal.ZERO);
            pond.setTemperatureAdjustmentExpiresAt(null);
        }
        if (pond.getOwner().getLocation() == null) {
            pond.setTemperature(oldBaseTemperature.add(adjustment).setScale(1, RoundingMode.HALF_UP));
            return;
        }
        try {
            BigDecimal airTemperature = weatherService.getCurrentTemperature(pond.getOwner().getLocation());
            BigDecimal newBase = oldBaseTemperature.add(
                    config.getTemperatureResponseRate().multiply(airTemperature.subtract(oldBaseTemperature)));
            pond.setTemperature(newBase.add(adjustment).setScale(1, RoundingMode.HALF_UP));
        } catch (RuntimeException ignored) {
            pond.setTemperature(oldBaseTemperature.add(adjustment).setScale(1, RoundingMode.HALF_UP));
        }
    }

    private BigDecimal randomTenths(int minimumTenths, int maximumTenths) {
        return BigDecimal.valueOf(ThreadLocalRandom.current().nextInt(minimumTenths, maximumTenths + 1), 1);
    }
}
