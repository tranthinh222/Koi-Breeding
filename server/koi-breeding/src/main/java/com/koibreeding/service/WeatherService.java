package com.koibreeding.service;

import java.math.BigDecimal;
import com.koibreeding.enums.Location;

public interface WeatherService {
    BigDecimal getCurrentTemperature(Location location);
}
