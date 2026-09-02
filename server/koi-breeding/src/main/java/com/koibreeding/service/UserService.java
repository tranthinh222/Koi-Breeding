package com.koibreeding.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.koibreeding.domain.User;
import com.koibreeding.dto.response.ResultPaginationDTO;
import com.koibreeding.dto.response.ResUserDto;
import com.koibreeding.repository.UserRepository;

import com.koibreeding.service.CloudinaryUploadService;
import java.util.Map;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final CloudinaryUploadService cloudinaryUploadService;

    public UserService(UserRepository userRepository, CloudinaryUploadService cloudinaryUploadService) {
        this.userRepository = userRepository;
        this.cloudinaryUploadService = cloudinaryUploadService;
    }

    public User handleFetchUserById(Integer userId) {
        return userRepository.findById(userId).orElse(null);
    }
    public User handleFetchUserByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    public ResUserDto convertToResUserDto(User user) {
        return ResUserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .birthday(user.getBirthday())
                .gender(user.getGender())
                .role(user.getRole())
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

    public User handleFetchProfileByUserId(Integer userId) {
        return this.userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User with id '" + userId + "' is not exist."));
    }

    public User handleUpdateProfile(Integer userId, User userUpdate) {
        User currentUser = this.handleFetchProfileByUserId(userId);

        if (userUpdate.getUsername() != null && !userUpdate.getUsername().isBlank()) {
            currentUser.setUsername(userUpdate.getUsername());
        }
        if (userUpdate.getEmail() != null && !userUpdate.getEmail().isBlank()) {
            currentUser.setEmail(userUpdate.getEmail());
        }
        if (userUpdate.getBirthday() != null) {
            currentUser.setBirthday(userUpdate.getBirthday());
        }
        if (userUpdate.getGender() != null) {
            currentUser.setGender(userUpdate.getGender());
        }
        if (userUpdate.getAvatarUrl() != null && !userUpdate.getAvatarUrl().isBlank()) {
            currentUser.setAvatarUrl(userUpdate.getAvatarUrl());
        }

        return this.userRepository.save(currentUser);
    }

    public String handleUploadAvatar(Integer userId, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Avatar file is required.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.toLowerCase().startsWith("image/")) {
            throw new IllegalArgumentException("Avatar file format is invalid. Only image files are allowed.");
        }

        User currentUser = this.handleFetchProfileByUserId(userId);
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        if (fileName.isBlank()) {
            throw new IllegalArgumentException("Avatar file name is invalid.");
        }

        String fileExtension = StringUtils.getFilenameExtension(fileName);
        if (fileExtension == null || fileExtension.isBlank()) {
            throw new IllegalArgumentException("Avatar file extension is invalid.");
        }

        try {
            String avatarUrl = this.cloudinaryUploadService.uploadImage(file);
            currentUser.setAvatarUrl(avatarUrl);
            this.userRepository.save(currentUser);
            return avatarUrl;
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload avatar for user id '" + userId + "'.", e);
        }
    }
/* 
    public String handleUploadAvatar(Integer userId, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Avatar file is required.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.toLowerCase().startsWith("image/")) {
            throw new IllegalArgumentException("Avatar file format is invalid. Only image files are allowed.");
        }

        User currentUser = this.handleFetchProfileByUserId(userId);
        String oldAvatarUrl = currentUser.getAvatarUrl();
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        if (fileName.isBlank()) {
            throw new IllegalArgumentException("Avatar file name is invalid.");
        }

        String extension = StringUtils.getFilenameExtension(fileName);
        if (extension == null || extension.isBlank()) {
            throw new IllegalArgumentException("Avatar file extension is invalid.");
        }

        String safeFileName = "user-" + userId + "-" + System.currentTimeMillis() + "." + extension;

        Path uploadDir = Paths.get("uploads", "avatars").toAbsolutePath().normalize();
        try {
            Files.createDirectories(uploadDir);
            Path target = uploadDir.resolve(safeFileName);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            String avatarUrl = "/uploads/avatars/" + safeFileName;
            currentUser.setAvatarUrl(avatarUrl);
            this.userRepository.save(currentUser);
            deleteOldAvatar(oldAvatarUrl, avatarUrl, uploadDir);

            return avatarUrl;
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload avatar for user id '" + userId + "'.", e);
        }

        
    }
*/
    private void deleteOldAvatar(String oldAvatarUrl, String newAvatarUrl, Path uploadDir) throws IOException {
        if (oldAvatarUrl == null || oldAvatarUrl.isBlank() || oldAvatarUrl.equals(newAvatarUrl)) {
            return;
        }

        String avatarPrefix = "/uploads/avatars/";
        if (!oldAvatarUrl.startsWith(avatarPrefix)) {
            return;
        }

        String oldFileName = StringUtils.cleanPath(oldAvatarUrl.substring(avatarPrefix.length()));
        if (oldFileName.isBlank() || oldFileName.contains("..")) {
            return;
        }

        Path oldAvatarPath = uploadDir.resolve(oldFileName).normalize();
        if (oldAvatarPath.startsWith(uploadDir)) {
            Files.deleteIfExists(oldAvatarPath);
        }
    }

    public ResultPaginationDTO handleFetchAllUsers(Pageable pageable) {
        Page<User> pageUser = this.userRepository.findAll(pageable);
        ResultPaginationDTO resultPaginationDTO = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setTotalPages(pageUser.getTotalPages());
        meta.setTotalElements(pageUser.getTotalElements());

        resultPaginationDTO.setMeta(meta);

        List<User> userList = pageUser.getContent();

        resultPaginationDTO.setResult(userList);

        return resultPaginationDTO;
    }

    public void handleDeleteUser(Integer id) {
        this.userRepository.deleteById(id);
    }

    public boolean isUserExistById(Integer id) {
        return this.userRepository.existsById(id);
    }
}
