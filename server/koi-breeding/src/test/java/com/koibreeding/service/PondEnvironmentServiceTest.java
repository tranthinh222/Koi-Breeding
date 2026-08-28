package com.koibreeding.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import org.junit.jupiter.api.Test;

import com.koibreeding.domain.Pond;
import com.koibreeding.domain.User;
import com.koibreeding.enums.PhTrend;
import com.koibreeding.repository.PondRepository;
import com.koibreeding.config.PondEnvironmentConfig;
import com.koibreeding.enums.Location;

class PondEnvironmentServiceTest {
    @Test
    void dailyUpdateAppliesAllRulesAndWeatherFormula() {
        PondRepository repository = mock(PondRepository.class);
        WeatherService weather = mock(WeatherService.class);
        when(weather.getCurrentTemperature(Location.HO_CHI_MINH_CITY)).thenReturn(new BigDecimal("30"));
        PondEnvironmentService service = new PondEnvironmentService(repository, weather, environmentConfig());

        User owner = new User();
        owner.setLocation(Location.HO_CHI_MINH_CITY);
        Pond pond = new Pond();
        pond.setOwner(owner);
        pond.setWaterQuality(new BigDecimal("80.0"));
        pond.setOxygen(new BigDecimal("7.00"));
        pond.setPH(new BigDecimal("7.0"));
        pond.setPhTrend(PhTrend.ALKALINE);
        pond.setPhTrendChangedAt(OffsetDateTime.now().minusDays(10));
        pond.setTemperature(new BigDecimal("20.0"));
        pond.setTemperatureAdjustment(BigDecimal.ZERO);

        service.updatePond(pond, OffsetDateTime.now());

        assertTrue(pond.getWaterQuality().compareTo(new BigDecimal("75.0")) >= 0);
        assertTrue(pond.getWaterQuality().compareTo(new BigDecimal("77.0")) <= 0);
        assertTrue(pond.getOxygen().compareTo(new BigDecimal("6.60")) >= 0);
        assertTrue(pond.getOxygen().compareTo(new BigDecimal("6.80")) <= 0);
        assertTrue(pond.getPH().compareTo(new BigDecimal("7.1")) >= 0);
        assertTrue(pond.getPH().compareTo(new BigDecimal("7.3")) <= 0);
        assertEquals(new BigDecimal("22.0"), pond.getTemperature());
    }

    @Test
    void switchesPhTrendAfterThirtyDays() {
        PondEnvironmentService service = new PondEnvironmentService(mock(PondRepository.class),
                mock(WeatherService.class), environmentConfig());
        User owner = new User();
        Pond pond = new Pond();
        pond.setOwner(owner);
        pond.setWaterQuality(new BigDecimal("80"));
        pond.setOxygen(new BigDecimal("7"));
        pond.setPH(new BigDecimal("7"));
        pond.setTemperature(new BigDecimal("24"));
        pond.setTemperatureAdjustment(BigDecimal.ZERO);
        pond.setPhTrend(PhTrend.ACIDIC);
        OffsetDateTime now = OffsetDateTime.now();
        pond.setPhTrendChangedAt(now.minusDays(30));

        service.updatePond(pond, now);

        assertEquals(PhTrend.ALKALINE, pond.getPhTrend());
        assertEquals(now, pond.getPhTrendChangedAt());
    }

    private PondEnvironmentConfig environmentConfig() {
        PondEnvironmentConfig config = new PondEnvironmentConfig();
        config.setTemperatureResponseRate(new BigDecimal("0.2"));
        config.setWaterQualityDecreaseMinTenths(30);
        config.setWaterQualityDecreaseMaxTenths(50);
        config.setOxygenDecreaseMinTenths(2);
        config.setOxygenDecreaseMaxTenths(4);
        config.setPhChangeMinTenths(1);
        config.setPhChangeMaxTenths(3);
        config.setPhTrendDurationDays(30);
        return config;
    }
}
