package com.koibreeding.dto.response;

import java.math.BigDecimal;

import com.koibreeding.domain.Item;
import com.koibreeding.enums.EffectType;
import com.koibreeding.enums.ItemType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResItemInventory {
    private Integer id;
    private String name;
    private BigDecimal price;
    private ItemType itemType;
    private BigDecimal effectValue;
    private EffectType effectType;
    private String description;
    private Integer quantity;
    private String image;

}