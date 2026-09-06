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

        List<Item> seededItems = new ArrayList<>(SampleData.getSampleItemList());

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
        System.out.println(">>> Seeded Items");
    }

}
