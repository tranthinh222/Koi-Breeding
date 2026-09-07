package com.koibreeding.seeder;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import com.koibreeding.domain.Pond;
import com.koibreeding.domain.User;
import com.koibreeding.enums.PhTrend;
import com.koibreeding.repository.PondRepository;
import com.koibreeding.repository.UserRepository;

@Component
@Order(7)
public class PondSeeder implements CommandLineRunner {
    private PondRepository pondRepository;
    private UserRepository userRepository;

    public PondSeeder(PondRepository pondRepository, UserRepository userRepository) {
        this.pondRepository = pondRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (pondRepository.count() > 0) {
            System.out.println(">>> Ponds already exist");
            return;
        }

        List<String> defaultUsers = new ArrayList<>();
        for (int i = 1; i <= 5; ++i) {
            defaultUsers.add("admin" + i);
            defaultUsers.add("player" + i);
        }

        List<User> existingUserList = userRepository.findAll().stream()
                .filter(user -> defaultUsers.contains(user.getUsername())).collect(Collectors.toList());

        List<Pond> seededPonds = List.of(
                new Pond(null, "Kohaku Garden", null, 10, 10, BigDecimal.valueOf(70.0), BigDecimal.valueOf(24.5),
                        BigDecimal.valueOf(7.2), BigDecimal.valueOf(7.5), PhTrend.ALKALINE, OffsetDateTime.now(), null,
                        BigDecimal.ZERO, null, null, "Sample pond for testing environment APIs."),
                new Pond(null, "Sanke Lake", null, 5, 5, BigDecimal.valueOf(92.0), BigDecimal.valueOf(25.0),
                        BigDecimal.valueOf(7.5), BigDecimal.valueOf(8.2), PhTrend.ACIDIC, OffsetDateTime.now(), null,
                        BigDecimal.ZERO, null, null, "A healthy sample pond owned by demo_user."),
                new Pond(null, "Hanoi Koi Pond", null, 3, 3, BigDecimal.valueOf(84.0), BigDecimal.valueOf(23.5),
                        BigDecimal.valueOf(7.0), BigDecimal.valueOf(7.8), PhTrend.ALKALINE, OffsetDateTime.now(), null,
                        BigDecimal.ZERO, null, null, "Sample pond used to test weather updates for Hanoi."));

        List<Pond> pondsToSave = new ArrayList<>();

        for (User user : existingUserList) {
            if (user.getUsername().startsWith("admin")) {
                for (Pond template : seededPonds) {
                    pondsToSave.add(clonePondForUser(template, user));
                }
            } else if (user.getUsername().startsWith("player")) {
                pondsToSave.add(clonePondForUser(seededPonds.get(0), user));
            }
        }

        pondRepository.saveAll(pondsToSave);
        System.out.println(">>> Seeded Ponds Successfully");

    }

    private Pond clonePondForUser(Pond template, User owner) {
        return new Pond(
                null,
                template.getName(),
                owner,
                template.getLevel(),
                template.getCapacity(),
                template.getWaterQuality(),
                template.getTemperature(),
                template.getPH(),
                template.getOxygen(),
                template.getPhTrend(),
                OffsetDateTime.now(),
                null,
                BigDecimal.ZERO,
                null,
                null,
                template.getDescription());
    }

}
