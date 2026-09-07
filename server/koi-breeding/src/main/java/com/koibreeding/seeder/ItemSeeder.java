package com.koibreeding.seeder;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import com.koibreeding.domain.Dictionary;
import com.koibreeding.domain.Item;
import com.koibreeding.enums.EffectType;
import com.koibreeding.enums.ItemType;
import com.koibreeding.repository.DictionaryRepository;
import com.koibreeding.repository.ItemRepository;

@Component
@Order(4)
public class ItemSeeder implements CommandLineRunner {
    private ItemRepository itemRepository;
    private DictionaryRepository dictionaryRepository;

    public ItemSeeder(ItemRepository itemRepository, DictionaryRepository dictionaryRepository) {
        this.itemRepository = itemRepository;
        this.dictionaryRepository = dictionaryRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (itemRepository.count() > 0) {
            System.out.println(">>> Items already exist");
            return;
        }

        List<Item> seededItems = new ArrayList<>(List.of(
                new Item(null, "Koi Food - Aqua Master", BigDecimal.valueOf(15.0), 1, ItemType.FOOD, EffectType.GROWTH,
                        BigDecimal.valueOf(15.0),
                        "Common food that restores 15 food points.",
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1786628411/uploads/items/vdgmp3zgrcwy6qfaduv5.svg"),
                new Item(null, "Koi Food - Bethech", BigDecimal.valueOf(25.0), 1, ItemType.FOOD, EffectType.GROWTH,
                        BigDecimal.valueOf(30.0),
                        "Standard food that restores 30 food points.",
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1786628498/uploads/items/jbpkxycegrmrtiywi0tq.svg"),
                new Item(null, "Koi Food - Ipick", BigDecimal.valueOf(45.0), 1, ItemType.FOOD, EffectType.GROWTH,
                        BigDecimal.valueOf(50.0),
                        "Premium food that restores 50 food points.",
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1786628532/uploads/items/fnn7slmun7ktkkttifes.svg"),
                new Item(null, "Koi Food - Kofu", BigDecimal.valueOf(75.0), 1, ItemType.FOOD, EffectType.GROWTH,
                        BigDecimal.valueOf(90.0),
                        "Legendary food that restores 90 food points.",
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1786628571/uploads/items/wtvx5qvpkwxcnsaj6guw.svg"),
                new Item(null, "Koi Food - Koi King", BigDecimal.valueOf(35.0), 1, ItemType.FOOD, EffectType.GROWTH,
                        BigDecimal.valueOf(40.0),
                        "A balanced daily food for healthy Koi.",
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1786628891/uploads/items/pvsyus6qwcebvhpaxd0j.svg"),
                new Item(null, "Environment Elixir - KMnO4", BigDecimal.valueOf(15.0), 1, ItemType.MEDICINE,
                        EffectType.WATER_QUALITY, BigDecimal.valueOf(15.0),
                        "Restores 15 water-quality points and helps disinfect the pond.",
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1786628948/uploads/items/b6s6nqu3phlh79obevyc.svg"),
                new Item(null, "Environment Elixir - ORARPS", BigDecimal.valueOf(25.0), 1, ItemType.MEDICINE,
                        EffectType.WATER_QUALITY, BigDecimal.valueOf(30.0),
                        "Standard treatment for pond water quality.",
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1786629001/uploads/items/esai3zntpelx0d2jdv7d.svg"),
                new Item(null, "Environment Elixir - DIMILIN", BigDecimal.valueOf(45.0), 1, ItemType.MEDICINE,
                        EffectType.WATER_QUALITY, BigDecimal.valueOf(50.0),
                        "Premium water-quality treatment for a clean pond.",
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1786629031/uploads/items/nssd84q3glrt5mkz82nj.svg"),
                new Item(null, "Disease Cure - Link", BigDecimal.valueOf(15.0), 1, ItemType.MEDICINE,
                        EffectType.WATER_QUALITY, BigDecimal.valueOf(10.0),
                        "Common medicine used to treat minor Koi diseases.",
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1786629083/uploads/items/ycpzocraxl4gmgordzvu.svg"),
                new Item(null, "Disease Cure - MIP", BigDecimal.valueOf(25.0), 1, ItemType.MEDICINE,
                        EffectType.WATER_QUALITY,
                        BigDecimal.valueOf(25.0),
                        "Standard medicine for treating common diseases.",
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1786629116/uploads/items/to9axfaid3gm2y4brqxv.svg"),
                new Item(null, "Disease Cure - Cloak", BigDecimal.valueOf(45.0), 1, ItemType.MEDICINE,
                        EffectType.WATER_QUALITY, BigDecimal.valueOf(45.0),
                        "Premium cure for severe Koi diseases.",
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1786629140/uploads/items/qxryphcvy1acd8fijyfv.svg"),
                new Item(null, "Cooling Treatment", BigDecimal.valueOf(25.0), 1, ItemType.MEDICINE,
                        EffectType.COOLING, BigDecimal.valueOf(2.0),
                        "Temporarily decreases pond temperature by 2°C for 24 hours.",
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1788656564/uploads/items/kcvvjuo5xbzzz1hbwffd.png"),
                new Item(null, "Heating Treatment", BigDecimal.valueOf(25.0), 1, ItemType.MEDICINE,
                        EffectType.HEATING, BigDecimal.valueOf(2.0),
                        "Temporarily increases pond temperature by 2°C for 24 hours.",
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1788656768/uploads/items/ss6eugzzuebfip4uuop0.png"),
                new Item(null, "Mutation Elixir - CLAK", BigDecimal.valueOf(15.0), 1, ItemType.MEDICINE,
                        EffectType.MUTATION,
                        BigDecimal.valueOf(5.0),
                        "Common elixir with a small mutation bonus.",
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1786629184/uploads/items/hbuwdasojzkzc4lq2lpu.svg"),
                new Item(null, "Health Elixir - KAFKA", BigDecimal.valueOf(45.0), 1, ItemType.MEDICINE,
                        EffectType.GROWTH,
                        BigDecimal.valueOf(40.0),
                        "Premium health elixir that improves Koi recovery.",
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1786629220/uploads/items/q1octogpibw1pksh2yez.svg"),
                new Item(null, "Koins Pack - 250", BigDecimal.valueOf(25000), 1, ItemType.CURRENCY, null,
                        BigDecimal.valueOf(250),
                        "Receive 250 Koins after successful payment.",
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1786618553/uploads/items/d27v3vwzkdp1bj2cpllt.svg"),
                new Item(null, "Koins Pack - 750", BigDecimal.valueOf(75000), 1, ItemType.CURRENCY, null,
                        BigDecimal.valueOf(750),
                        "Receive 750 Koins after successful payment.",
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1786621657/uploads/items/i2ixkywqfkon8d9dwqvg.svg"),
                new Item(null, "Koins Pack - 3000", BigDecimal.valueOf(300000), 1, ItemType.CURRENCY, null,
                        BigDecimal.valueOf(3000),
                        "Receive 3,000 Koins after successful payment.",
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1786629378/uploads/items/f5y9pbvqldhcixknvysf.svg"),
                new Item(null, "Koins Pack - 9000", BigDecimal.valueOf(850000), 1, ItemType.CURRENCY, null,
                        BigDecimal.valueOf(9000),
                        "Receive 9,000 Koins after successful payment.",
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1786629408/uploads/items/u5u9yoemfldk9ppndwbv.svg"),
                new Item(null, "Koins Pack - 25000", BigDecimal.valueOf(2200000), 1, ItemType.CURRENCY, null,
                        BigDecimal.valueOf(25000),
                        "Receive 25,000 Koins after successful payment.",
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1786629525/uploads/items/xhaaz1lvc5jqmolrqo4t.svg")

        ));

        Map<String, Dictionary> existingDictionariesByName = dictionaryRepository.findAll().stream()
                .filter(Objects::nonNull)
                .filter(v -> v.getName() != null)
                .collect(Collectors.toMap(
                        v -> v.getName(),
                        item -> item,
                        (left, right) -> left,
                        LinkedHashMap::new));

        List<String> starterKoiNames = List.of(
                "Kohaku", "Yamato Nishiki", "Showa Sanshoku", "Goromo", "Shiro Utsuri Doitsu", "Shiro Bekko",
                "Platinum Ogon", "Konjo Asagi", "Magoi");

        existingDictionariesByName.forEach((name, dictionary) -> {
            if (starterKoiNames.contains(name)) {
                Item item = new Item(null, "Koi - " + name, BigDecimal.valueOf(dictionary.getBasePrice()), 1,
                        ItemType.KOI, EffectType.GROWTH, BigDecimal.valueOf(dictionary.getId()),
                        dictionary.getVariety().getDescription(), dictionary.getImageUrl());

                // (Tùy chọn) Có thể set isPurchasable = true ở đây nếu bạn dùng Hướng 1
                seededItems.add(item);
            }
        });

        itemRepository.saveAll(seededItems);
        System.out.println(">>> Seeded Items Successfully");
    }

}
