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
}
