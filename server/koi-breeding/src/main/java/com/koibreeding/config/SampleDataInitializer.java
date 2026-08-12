package com.koibreeding.config;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.koibreeding.domain.Item;
import com.koibreeding.enums.EffectType;
import com.koibreeding.enums.ItemType;
import com.koibreeding.repository.ItemRepository;

@Configuration
public class SampleDataInitializer {

    @Bean
    CommandLineRunner seedShopItems(ItemRepository itemRepository) {
        return args -> {
            if (itemRepository.count() > 0) {
                return;
            }

            itemRepository.saveAll(List.of(
                    item("Koi Food - Aqua Master", "15.00", ItemType.FOOD, EffectType.GROWTH, "15.00", "Common food that restores 15 food points."),
                    item("Koi Food - Bethech", "25.00", ItemType.FOOD, EffectType.GROWTH, "30.00", "Standard food that restores 30 food points."),
                    item("Koi Food - Ipick", "45.00", ItemType.FOOD, EffectType.GROWTH, "50.00", "Premium food that restores 50 food points."),
                    item("Koi Food - Kofu", "75.00", ItemType.FOOD, EffectType.GROWTH, "90.00", "Legendary food that restores 90 food points."),
                    item("Koi Food - Sakura Blend", "35.00", ItemType.FOOD, EffectType.GROWTH, "40.00", "A balanced daily food for healthy Koi."),

                    item("Environment Elixir - KMnO4", "15.00", ItemType.MEDICINE, EffectType.WATER_QUALITY, "15.00", "Restores 15 water-quality points and helps disinfect the pond."),
                    item("Environment Elixir - ORARPS", "25.00", ItemType.MEDICINE, EffectType.WATER_QUALITY, "30.00", "Standard treatment for pond water quality."),
                    item("Environment Elixir - DIMILIN", "45.00", ItemType.MEDICINE, EffectType.WATER_QUALITY, "50.00", "Premium water-quality treatment for a clean pond."),
                    item("Disease Cure - Link", "15.00", ItemType.MEDICINE, EffectType.WATER_QUALITY, "10.00", "Common medicine used to treat minor Koi diseases."),
                    item("Disease Cure - MIP", "25.00", ItemType.MEDICINE, EffectType.WATER_QUALITY, "25.00", "Standard medicine for treating common diseases."),
                    item("Disease Cure - Cloak", "45.00", ItemType.MEDICINE, EffectType.WATER_QUALITY, "45.00", "Premium cure for severe Koi diseases."),
                    item("Mutation Elixir - CLAK", "15.00", ItemType.MEDICINE, EffectType.MUTATION, "5.00", "Common elixir with a small mutation bonus."),
                    item("Health Elixir - KAFKA", "45.00", ItemType.MEDICINE, EffectType.GROWTH, "40.00", "Premium health elixir that improves Koi recovery."),

                    item("Koi - Kohaku", "100.00", ItemType.KOI, EffectType.GROWTH, "1.00", "Classic white Koi with vivid red Hi markings."),
                    item("Koi - Tancho", "180.00", ItemType.KOI, EffectType.GROWTH, "1.00", "Distinctive Koi with a signature red marking on its head."),
                    item("Koi - Taisho Sanke", "120.00", ItemType.KOI, EffectType.GROWTH, "1.00", "A graceful Koi with white, red, and black patterns."),

                    item("Koins Pack - 250", "0.99", ItemType.CURRENCY, null, "250.00", "Receive 250 Koins after successful payment."),
                    item("Koins Pack - 750", "2.99", ItemType.CURRENCY, null, "750.00", "Receive 750 Koins after successful payment."),
                    item("Koins Pack - 3000", "4.99", ItemType.CURRENCY, null, "3000.00", "Receive 3,000 Koins after successful payment."),
                    item("Koins Pack - 9000", "9.99", ItemType.CURRENCY, null, "9000.00", "Receive 9,000 Koins after successful payment.")));
        };
    }

    private Item item(String name, String price, ItemType itemType, EffectType effectType, String effectValue, String description) {
        Item item = new Item();
        item.setName(name);
        item.setPrice(new BigDecimal(price));
        item.setItemType(itemType);
        item.setEffectType(effectType);
        item.setEffectValue(new BigDecimal(effectValue));
        item.setUsageLimit(1);
        item.setDescription(description);
        return item;
    }
}
