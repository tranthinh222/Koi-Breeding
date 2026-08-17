package com.koibreeding.service;

import com.koibreeding.domain.User;
import com.koibreeding.dto.response.ResUserDto;
import com.koibreeding.repository.UserRepository;

import org.springframework.stereotype.Service;

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

    public void handleDeleteUser(Integer id) {
        this.userRepository.deleteById(id);
    }

    public boolean isUserExistById(Integer id) {
        return this.userRepository.existsById(id);
    }
}
