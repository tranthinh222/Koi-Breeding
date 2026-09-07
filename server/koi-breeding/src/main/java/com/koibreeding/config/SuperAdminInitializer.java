package com.koibreeding.config;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.koibreeding.domain.User;
import com.koibreeding.enums.Gender;
import com.koibreeding.enums.Location;
import com.koibreeding.enums.Role;
import com.koibreeding.enums.UserStatus;
import com.koibreeding.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "app.super-admin", name = "enabled", havingValue = "true")
public class SuperAdminInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.super-admin.username:}")
    private String username;

    @Value("${app.super-admin.email:}")
    private String email;

    @Value("${app.super-admin.password:}")
    private String password;

    @Override
    public void run(ApplicationArguments args) {
        if (userRepository.existsByRole(Role.SUPER_ADMIN)) {
            return;
        }

        validateConfiguration();

        if (userRepository.existsByUsername(username)) {
            throw new IllegalStateException("SUPER_ADMIN_USERNAME is already used by another account");
        }
        if (userRepository.existsByEmail(email)) {
            throw new IllegalStateException("SUPER_ADMIN_EMAIL is already used by another account");
        }

        User superAdmin = new User();
        superAdmin.setUsername(username.trim());
        superAdmin.setEmail(email.trim().toLowerCase());
        superAdmin.setPassword(passwordEncoder.encode(password));
        superAdmin.setBirthday(LocalDate.of(2000, 1, 1));
        superAdmin.setGender(Gender.MALE);
        superAdmin.setLocation(Location.HO_CHI_MINH_CITY);
        superAdmin.setStatus(UserStatus.ACTIVE);
        superAdmin.setRole(Role.SUPER_ADMIN);
        superAdmin.setIsBanned(false);
        superAdmin.setFailedLoginAttempts(0);
        superAdmin.setExp(1);

        userRepository.save(superAdmin);
    }

    private void validateConfiguration() {
        if (username == null || username.isBlank()) {
            throw new IllegalStateException("SUPER_ADMIN_USERNAME must be configured");
        }
        if (email == null || email.isBlank() || !email.contains("@")) {
            throw new IllegalStateException("SUPER_ADMIN_EMAIL must be a valid email address");
        }
        if (password == null || password.length() < 12) {
            throw new IllegalStateException("SUPER_ADMIN_PASSWORD must contain at least 12 characters");
        }
    }
}
