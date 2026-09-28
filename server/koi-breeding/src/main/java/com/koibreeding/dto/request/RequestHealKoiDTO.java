package com.koibreeding.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record RequestHealKoiDTO(@NotNull @Min(1) Integer userId,
        @NotNull Integer itemId, @NotNull @Min(1) Integer quantity) {
}
