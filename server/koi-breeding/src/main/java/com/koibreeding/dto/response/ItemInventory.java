package com.koibreeding.dto.response;

import java.math.BigDecimal;

import com.koibreeding.domain.Item;
import com.koibreeding.enums.EffectType;
import com.koibreeding.enums.ItemType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ItemInventory {
    private Integer id;
    private String name;
    private BigDecimal price;
    private ItemType itemType;
    private EffectType effectType;
    private String description;
    private Integer quantity;
    private String image;
    public ItemInventory(
        Integer id,
        String name,
        BigDecimal price,
        ItemType itemType,
        EffectType effectType,
        String description, 
        Integer quantity,
        String image) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.itemType = itemType;
        this.effectType = effectType;
        this.description = description;
        this.quantity = quantity;
        this.image = image;
    }
}