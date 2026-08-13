package com.koibreeding.domain.response.home;

import java.time.OffsetDateTime;
import com.koibreeding.enums.BreedingType;

public class BreedingSummary {
    private Integer id;
    private BreedingType breedingType;
    private OffsetDateTime startedAt;
    private OffsetDateTime expectedHatchDate;
    private OffsetDateTime endedAt;
}