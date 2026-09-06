package com.koibreeding.seeder;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.context.annotation.Profile;

import com.koibreeding.domain.Variety;
import com.koibreeding.repository.DictionaryRepository;
import com.koibreeding.repository.VarietyRepository;

@Component
@Profile("!test")
@Order(3)
public class DictionarySeeder implements CommandLineRunner {
    private DictionaryRepository dictionaryRepository;
    private VarietyRepository varietyRepository;

    public DictionarySeeder(DictionaryRepository dictionaryRepository, VarietyRepository varietyRepository) {
        this.dictionaryRepository = dictionaryRepository;
        this.varietyRepository = varietyRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (dictionaryRepository.count() > 0) {
            System.out.println(">>> Dictionaries already exist");
            return;
        }

        Map<String, Variety> currentVariety = varietyRepository.findAll().stream()
                .filter(Objects::nonNull)
                .filter(v -> v.getName() != null)
                .collect(Collectors.toMap(
                        v -> v.getName(),
                        item -> item,
                        (left, right) -> left,
                        LinkedHashMap::new));

        dictionaryRepository.saveAll(SampleData.getSampleDictionaryList().stream()
                .map(seededDictionary -> {
                    seededDictionary.setVariety(currentVariety
                            .get(seededDictionary.getVariety().getName()));
                    return seededDictionary;
                })
                .toList());
        System.out.println(">>> Seeded Dictionaries");
    }
}
