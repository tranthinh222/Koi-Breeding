package com.koibreeding.service;

import org.springframework.stereotype.Service;

import com.koibreeding.domain.User;
import com.koibreeding.dto.response.ResUserDto;
import com.koibreeding.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
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
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .exp(user.getExp())
                .build();
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
