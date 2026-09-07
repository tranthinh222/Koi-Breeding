package com.koibreeding.dto.request;

import com.koibreeding.enums.BreedingType;
import jakarta.validation.constraints.NotNull;

public record CreateBreedingEventRequest(
        @NotNull Integer fatherId,
        @NotNull Integer motherId,
        @NotNull Integer pondId,
        @NotNull BreedingType breedingType,
        @NotNull Integer userId) {
}
