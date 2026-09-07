package com.koibreeding.dto.request;

import jakarta.validation.constraints.NotNull;
import com.koibreeding.enums.Location;

public record UpdateLocationRequest(@NotNull Location location) {
}
