package com.koibreeding.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.koibreeding.domain.User;
import com.koibreeding.dto.response.ResUserDto;
import com.koibreeding.service.UserService;
import com.koibreeding.util.annotation.ApiMessage;
import com.koibreeding.util.error.IdInvalidException;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/users/{id}")
    @ApiMessage("fetch user by id")
    public ResponseEntity<ResUserDto> getUserById(@PathVariable Integer id) throws IdInvalidException {
        User fetchUser = this.userService.handleFetchUserById(id);
        if (fetchUser == null) {
            throw new IdInvalidException("User with id " + id + " not found");
        }

        return ResponseEntity.status(HttpStatus.OK).body(this.userService.convertToResUserDto(fetchUser));
    }
    @GetMapping("/users/profile")
    public ResponseEntity<ResUserDto> getUserProfile(@RequestParam Integer id) {
        if (!userService.isUserExistById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User with id '" + id + "' does not exist.");
        }
        User profile = userService.handleFetchProfileByUserId(id);
        return ResponseEntity.status(HttpStatus.OK).body(this.userService.convertToResUserDto(profile));
    }
    @PutMapping("/users/profile")
    public ResponseEntity<ResUserDto> updateUserProfile(@RequestParam Integer id, @RequestBody User userUpdate) {
        if (!userService.isUserExistById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User with id '" + id + "' does not exist.");
        }
        User updateUser = userService.handleUpdateProfile(id, userUpdate);
        return ResponseEntity.status(HttpStatus.OK).body(this.userService.convertToResUserDto(updateUser));
    }
    @PostMapping("/users/avatar")
    public ResponseEntity<Map<String, String>> uploadAvatar(@RequestParam Integer id,
            @RequestParam("file") MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")){
            throw new IllegalArgumentException("Content file must be an image.");
        }
        String avatarUrl = userService.handleUploadAvatar(id, file);
        return ResponseEntity.ok(Map.of("avatarUrl", avatarUrl));
    }
    
}
