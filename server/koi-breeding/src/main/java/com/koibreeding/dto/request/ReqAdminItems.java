package com.koibreeding.dto.request;

import com.koibreeding.enums.EffectType;
import com.koibreeding.enums.ItemType;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReqAdminItems {
    Integer id;
    String imageUrl;
    String nameItem;
    String description;
    ItemType itemType;
    BigDecimal price;
    EffectType effectType;
    @jakarta.validation.constraints.DecimalMin(value = "0", message = "Effect value must not be negative")
    @jakarta.validation.constraints.Digits(integer = 8, fraction = 2, message = "Effect value must have at most 8 integer digits and 2 decimal places")
    BigDecimal effectValue;
}
