package com.koibreeding.seeder;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.koibreeding.domain.User;
import com.koibreeding.enums.Gender;
import com.koibreeding.enums.Location;
import com.koibreeding.enums.Role;
import com.koibreeding.enums.UserStatus;
import com.koibreeding.repository.UserRepository;

@Component
@Order(5)
public class UserSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            System.out.println(">>> Users already exist");
            return;
        }

        seedAdmin();
        seedPlayer();

        System.out.println(">>> Seeded Users Successfully");
    }

    public void seedAdmin() {
        List<User> admins = new ArrayList<>();
        for (int i = 1; i <= 5; i++) {
            String username = "admin" + i;
            String email = "admin" + i + "@gmail.com";
            String hashPassword = passwordEncoder.encode("123456");
            LocalDate birthDate = LocalDate.of(2005, i, 10 + i);
            Gender gender = (i % 2 == 0) ? Gender.MALE : Gender.FEMALE;
            UserStatus status = UserStatus.ACTIVE;
            Role role = Role.ADMIN;
            int level = i * 100;
            Location location = Location.HO_CHI_MINH_CITY;

            User admin = user(username, email, hashPassword, birthDate, gender, status, role, false, level, null,
                    location, null);

            admins.add(admin);
        }

        userRepository.saveAll(admins);
    }

    public void seedPlayer() {
        List<User> players = new ArrayList<>();
        for (int i = 1; i <= 5; i++) {
            String username = "player" + i;
            String email = "player" + i + "@gmail.com";
            String hashPassword = passwordEncoder.encode("123456");
            LocalDate birthDate = LocalDate.of(2005, i, 10 + i);
            Gender gender = (i % 2 == 0) ? Gender.MALE : Gender.FEMALE;
            UserStatus status = UserStatus.ACTIVE;
            Role role = Role.USER;
            int level = i * 100;
            Location location = Location.HO_CHI_MINH_CITY;

            User player = user(username, email, hashPassword, birthDate, gender, status, role, false, level, null,
                    location, null);
            players.add(player);
        }

        userRepository.saveAll(players);
    }

    public User user(String username, String email, String password, LocalDate birthday, Gender gender,
            UserStatus status, Role role, boolean isBanned, int level, String avatarUrl, Location location,
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
        user.setLevel(level);
        user.setAvatarUrl(avatarUrl);
        user.setLocation(location);
        user.setLocationUpdatedAt(locationUpdateAt);

        return user;
    }
}
