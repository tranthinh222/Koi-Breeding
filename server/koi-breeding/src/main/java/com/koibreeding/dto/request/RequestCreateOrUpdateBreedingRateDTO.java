package com.koibreeding.dto.request;

import java.math.BigDecimal;

import com.koibreeding.enums.BreedingRecipeType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RequestCreateOrUpdateBreedingRateDTO {
    private Integer fatherId;
    private Integer motherId;
    private Integer childId;
    private BreedingRecipeType type;
    private BigDecimal targetRate;
    private BigDecimal fatherRate;
    private BigDecimal motherRate;
}
