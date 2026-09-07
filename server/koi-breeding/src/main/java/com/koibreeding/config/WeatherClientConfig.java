package com.koibreeding.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;
import org.springframework.beans.factory.annotation.Value;

@Configuration
public class WeatherClientConfig {
    @Bean("weatherForecastClient")
    RestClient weatherForecastClient(@Value("${app.weather.forecast-url}") String baseUrl) {
        return RestClient.builder().baseUrl(baseUrl).build();
    }
}
