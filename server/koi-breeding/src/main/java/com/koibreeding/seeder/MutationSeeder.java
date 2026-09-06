package com.koibreeding.seeder;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import com.koibreeding.domain.Mutation;
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

        mutationRepository.saveAll(SAMPLE_MUTATIONS);
        System.out.println(">>> Seeded Mutations Successfully");
    }

    private static final List<Mutation> SAMPLE_MUTATIONS = List.of(
            new Mutation(null, "Ginrin", BigDecimal.valueOf(0.05), BigDecimal.valueOf(0.98),
                    "Phát triển vảy kim cương làm giảm nhẹ kích thước tối đa."),
            new Mutation(null, "Doitsu", BigDecimal.valueOf(0.05), BigDecimal.valueOf(1.0),
                    "Kích thước tối đa tương đương dòng chuẩn."),
            new Mutation(null, "Butterfly", BigDecimal.valueOf(0.05), BigDecimal.valueOf(0.95),
                    "Thân hình mảnh mai, chiều dài thân ngắn hơn."),
            new Mutation(null, "Jumbo Gene", BigDecimal.valueOf(0.05), BigDecimal.valueOf(1.08),
                    "Đột biến kích thước khổng lồ, giá trị cực cao."),
            new Mutation(null, "Bonsai Gene", BigDecimal.valueOf(0.05), BigDecimal.valueOf(0.9),
                    "Đột biến gen lùn, thân hình ngắn."));
}
