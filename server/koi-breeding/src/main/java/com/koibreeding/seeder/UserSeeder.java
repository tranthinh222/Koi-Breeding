package com.koibreeding.seeder;

import java.time.Instant;
import java.time.LocalDate;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.context.annotation.Profile;

import com.koibreeding.domain.User;
import com.koibreeding.enums.Gender;
import com.koibreeding.enums.Location;
import com.koibreeding.enums.Role;
import com.koibreeding.enums.UserStatus;
import com.koibreeding.repository.UserRepository;

@Component
@Profile("seed")
@ConditionalOnProperty(prefix = "app.seed", name = "enabled", havingValue = "true")
@Order(5)
public class UserSeeder implements CommandLineRunner {
    private final UserRepository userRepository;

    public UserSeeder(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            System.out.println(">>> Users already exist");
            return;
        }

        seedAdmin();
        seedPlayer();

        System.out.println(">>> Seeded Users");
    }

    public void seedAdmin() {
        for (int i = 1; i <= 5; i++) {
            String username = "admin" + i;
            String email = "admin" + i + "@gmail.com";
            // String hashPassword = passwordEncoder.encode("123456");
            String plainPassword = "123456";
            LocalDate birthDate = LocalDate.of(2005, i, 10 + i);
            Gender gender = (i % 2 == 0) ? Gender.MALE : Gender.FEMALE;
            UserStatus status = UserStatus.ACTIVE;
            Role role = Role.ADMIN;
            int exp = i * 100;
            Location location = Location.HO_CHI_MINH_CITY;

            User admin = user(username, email, plainPassword, birthDate, gender, status, role, false, exp, null,
                    location, null);
            userRepository.save(admin);
        }
    }

    public void seedPlayer() {
        for (int i = 1; i <= 5; i++) {
            String username = "player" + i;
            String email = "player" + i + "@gmail.com";
            // String hashPassword = passwordEncoder.encode("123456");
            String plainPassword = "123456";
            LocalDate birthDate = LocalDate.of(2005, i, 10 + i);
            Gender gender = (i % 2 == 0) ? Gender.MALE : Gender.FEMALE;
            UserStatus status = UserStatus.ACTIVE;
            Role role = Role.USER;
            int exp = i * 100;
            Location location = Location.HO_CHI_MINH_CITY;

            User admin = user(username, email, plainPassword, birthDate, gender, status, role, false, exp, null,
                    location, null);
            userRepository.save(admin);
        }
    }

    public User user(String username, String email, String password, LocalDate birthday, Gender gender,
            UserStatus status, Role role, boolean isBanned, int exp, String avatarUrl, Location location,
            Instant locationUpdateAt) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(password);
        user.setBirthday(birthday);
        user.setGender(gender);
        user.setStatus(status);
        user.setRole(role);
        user.setIsBanned(isBanned);
        user.setExp(exp);
        user.setAvatarUrl(avatarUrl);
        user.setLocation(location);
        user.setLocationUpdatedAt(locationUpdateAt);

        return user;
    }
}
