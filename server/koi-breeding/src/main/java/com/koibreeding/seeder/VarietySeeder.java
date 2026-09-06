package com.koibreeding.seeder;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import com.koibreeding.repository.VarietyRepository;

@Component
@ConditionalOnProperty(prefix = "app.seed.catalog", name = "enabled", havingValue = "true")
@Order(1)
public class VarietySeeder implements CommandLineRunner {
    private final VarietyRepository varietyRepository;

    public VarietySeeder(VarietyRepository varietyRepository) {
        this.varietyRepository = varietyRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (varietyRepository.count() > 0) {
            System.out.println(">>> Varieties already exist");
            return;
        }

        varietyRepository.saveAll(SampleData.getSampleVarietyList());
        System.out.println(">>> Seeded Varieties");
    }
}
