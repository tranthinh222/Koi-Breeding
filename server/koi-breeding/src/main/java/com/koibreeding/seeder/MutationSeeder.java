package com.koibreeding.seeder;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import com.koibreeding.repository.MutationRepository;

@Component
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
