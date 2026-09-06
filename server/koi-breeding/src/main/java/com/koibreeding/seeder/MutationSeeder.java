package com.koibreeding.seeder;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.context.annotation.Profile;

import com.koibreeding.repository.MutationRepository;

@Component
@Profile("seed")
@ConditionalOnProperty(prefix = "app.seed", name = "enabled", havingValue = "true")
@Order(2)
public class MutationSeeder implements CommandLineRunner {
    private MutationRepository mutationRepository;

    public MutationSeeder(MutationRepository mutationRepository) {
        this.mutationRepository = mutationRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (mutationRepository.count() > 0) {
            System.out.println(">>> Mutations already exist");
            return;
        }

        mutationRepository.saveAll(SampleData.getSampleMutationList());
        System.out.println(">>> Seeded Mutations");
    }
}
