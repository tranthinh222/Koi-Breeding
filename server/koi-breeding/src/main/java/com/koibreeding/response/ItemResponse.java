package com.koibreeding.response;

import com.koibreeding.enums.EffectType;
import com.koibreeding.enums.ItemType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
@Getter
@Setter
public class ItemResponse {
    private Integer id;
    private String name;
    private BigDecimal price;
    private ItemType itemType;
    private EffectType effectType;
    private BigDecimal effectValue;
    private String description;
    private Integer quantity;
    public ItemResponse(
             Integer id,
             String name,
             BigDecimal price,
             ItemType itemType,
             EffectType effectType,
             BigDecimal effectValue,
             String description,
             Integer quantity
    ){
        this.id = id;
        this.name = name;
        this.price = price;
        this.itemType = itemType;
        this.effectType = effectType;
        this.effectValue = effectValue;
        this.description = description;
        this.quantity = quantity;
    }
}
