package com.koibreeding.dto.response;

import java.time.OffsetDateTime;

import com.koibreeding.enums.BreedingStatus;
import com.koibreeding.enums.BreedingType;

public record ResBreedingEventDTO(
        Integer id,
        Owner user,
        ResKoiDTO male,
        ResKoiDTO female,
        PondSummary pond,
        BreedingType breedingType,
        OffsetDateTime startedAt,
        OffsetDateTime expectedHatchDate,
        OffsetDateTime endedAt,
        BreedingStatus status,
        Integer expectedEggCount) {
    public record Owner(Integer id, String username) {}
    public record PondSummary(Integer id, String name) {}
}
