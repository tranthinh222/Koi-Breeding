package com.koibreeding.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import org.springframework.stereotype.Service;

import com.koibreeding.domain.User;
import com.koibreeding.dto.response.ResUserDto;
import com.koibreeding.repository.UserRepository;

import com.koibreeding.config.PondEnvironmentConfig;
import com.koibreeding.enums.Location;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PondEnvironmentConfig environmentConfig;

    public UserService(UserRepository userRepository, PondEnvironmentConfig environmentConfig) {
        this.userRepository = userRepository;
        this.environmentConfig = environmentConfig;
    }

    public User handleFetchUserById(Integer userId) {
        return userRepository.findById(userId).orElse(null);
    }

    public ResUserDto convertToResUserDto(User user) {
        return ResUserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .birthday(user.getBirthday())
                .gender(user.getGender())
                .avatarUrl(user.getAvatarUrl())
                .location(user.getLocation())
                .locationUpdatedAt(user.getLocationUpdatedAt())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .exp(user.getExp())
                .build();
    }

    public ResUserDto updateLocation(Integer userId, Location location) {
        User user = handleFetchUserById(userId);
        if (user == null) throw new IllegalArgumentException("User not found: " + userId);
        Instant now = Instant.now();
        if (user.getLocationUpdatedAt() != null
                && user.getLocationUpdatedAt().plus(environmentConfig.getLocationChangeCooldownDays(),
                        ChronoUnit.DAYS).isAfter(now)) {
            throw new IllegalStateException("Location can only be changed once every 60 days");
        }
        user.setLocation(location);
        user.setLocationUpdatedAt(now);
        return convertToResUserDto(userRepository.save(user));
    }

    public User handleCreateUser(User user) {
        return this.userRepository.save(user);
    }

    public User handleUpdateUser(User user) {
        User currentUser = this.handleFetchUserById(user.getId());
        if (currentUser != null) {
            currentUser.setUsername(user.getUsername() != null ? user.getUsername() : currentUser.getUsername());
            currentUser.setEmail(user.getEmail() != null ? user.getEmail() : currentUser.getEmail());
            currentUser.setPassword(user.getPassword() != null ? user.getPassword() : currentUser.getPassword());
            currentUser.setBirthday(user.getBirthday() != null ? user.getBirthday() : currentUser.getBirthday());
            currentUser.setGender(user.getGender() != null ? user.getGender() : currentUser.getGender());
            currentUser.setStatus(user.getStatus() != null ? user.getStatus() : currentUser.getStatus());
            currentUser.setRole(user.getRole() != null ? user.getRole() : currentUser.getRole());
            currentUser.setIsBanned(user.getIsBanned() != null ? user.getIsBanned() : currentUser.getIsBanned());
            currentUser.setExp(user.getExp() != null ? user.getExp() : currentUser.getExp());
            currentUser.setAvatarUrl(user.getAvatarUrl() != null ? user.getAvatarUrl() : currentUser.getAvatarUrl());

            currentUser = this.userRepository.save(currentUser);
        }

        return currentUser;
    }

    public void handleDeleteUser(Integer id) {
        this.userRepository.deleteById(id);
    }

    public boolean isUserExistById(Integer id) {
        return this.userRepository.existsById(id);
    }
}
