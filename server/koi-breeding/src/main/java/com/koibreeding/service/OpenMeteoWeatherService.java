package com.koibreeding.service;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import com.koibreeding.enums.Location;

@Service
public class OpenMeteoWeatherService implements WeatherService {
    private final RestClient forecastClient;

    public OpenMeteoWeatherService(@Qualifier("weatherForecastClient") RestClient forecastClient) {
        this.forecastClient = forecastClient;
    }

    @Override
    public BigDecimal getCurrentTemperature(Location location) {
        ForecastResponse forecast = forecastClient.get()
                .uri("?latitude={latitude}&longitude={longitude}&current=temperature_2m",
                        location.getLatitude(), location.getLongitude())
                .retrieve().body(ForecastResponse.class);
        if (forecast == null || forecast.current() == null || forecast.current().temperature_2m() == null) {
            throw new IllegalStateException("Weather provider returned no current temperature");
        }
        return forecast.current().temperature_2m();
    }

    record ForecastResponse(CurrentWeather current) {}
    record CurrentWeather(BigDecimal temperature_2m) {}
}
