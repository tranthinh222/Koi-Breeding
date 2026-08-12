package com.koibreeding.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import com.koibreeding.domain.User;
import com.koibreeding.enums.Gender;
import com.koibreeding.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserServiceProfileTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void shouldReturnUserProfile_whenUserExists() {
        // Test tạo user id 1, tên alice, với các trường khác
        User user = new User();
        user.setId(1);
        user.setUsername("alice");
        user.setEmail("alice@example.com");
        user.setBirthday(LocalDate.of(2000, 1, 15));
        user.setGender(Gender.FEMALE);
        user.setAvatarUrl("/uploads/avatars/alice.png");

        when(userRepository.findById(1)).thenReturn(Optional.of(user));

        User result = userService.handleFetchProfileByUserId(1);

        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals("alice", result.getUsername());
        assertEquals("alice@example.com", result.getEmail());
        assertEquals("/uploads/avatars/alice.png", result.getAvatarUrl());
    }

    @Test
    void shouldUpdateProfile_whenUserExists() {
        // Test update user id 1, tên alice, với các trường khác
        User currentUser = new User();
        currentUser.setId(1);
        currentUser.setUsername("old_name");
        currentUser.setEmail("old@example.com");
        currentUser.setBirthday(LocalDate.of(1998, 5, 10));
        currentUser.setGender(Gender.MALE);
        currentUser.setAvatarUrl("/uploads/avatars/old.png");

        User updatedInfo = new User();
        updatedInfo.setUsername("new_name");
        updatedInfo.setEmail("new@example.com");
        updatedInfo.setBirthday(LocalDate.of(2001, 2, 20));
        updatedInfo.setGender(Gender.FEMALE);

        when(userRepository.findById(1)).thenReturn(Optional.of(currentUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User result = userService.handleUpdateProfile(1, updatedInfo);

        assertNotNull(result);
        assertEquals("new_name", result.getUsername());
        assertEquals("new@example.com", result.getEmail());
        assertEquals(LocalDate.of(2001, 2, 20), result.getBirthday());
        assertEquals(Gender.FEMALE, result.getGender());
    }

    @Test
    void shouldUploadAvatar_whenFileIsValid() {
        //Test upload avatar cho user
        User user = new User();
        user.setId(1);
        user.setUsername("alice");
        user.setEmail("alice@example.com");

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "avatar.png",
                "image/png",
                "avatar-content".getBytes()
        );

        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        String avatarUrl = userService.handleUploadAvatar(1, file);

        assertNotNull(avatarUrl);
        assertTrue(avatarUrl.startsWith("/uploads/avatars/user-1-"));
        assertTrue(avatarUrl.endsWith(".png"));
        assertEquals(avatarUrl, user.getAvatarUrl());
    }
}
