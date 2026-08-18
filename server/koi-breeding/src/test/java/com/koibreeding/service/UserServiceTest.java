package com.koibreeding.service;

import com.koibreeding.domain.User;
import com.koibreeding.dto.response.ResUserDto;
import com.koibreeding.enums.Gender;
import com.koibreeding.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private ResUserDto resUserDto;
    private User user;
    @BeforeEach
    void initData(){
        user = new User();
        user.setId(1);

        resUserDto = new ResUserDto();
        resUserDto.setId(1);
        resUserDto.setUsername("khoa");
        resUserDto.setEmail("khoa@gmail.com");
        resUserDto.setBirthday(LocalDate.of(1999,5,13));
        resUserDto.setGender(Gender.MALE);
        resUserDto.setAvatarUrl("1234567");
        resUserDto.setExp(100);
    }
    @Test
    void convertToResUserDto_success(){
        //WHEN + THEN
        ResUserDto result = userService.convertToResUserDto(user);

        assertEquals(user.getUsername(), result.getUsername());
        assertEquals(user.getEmail(), result.getEmail());
        assertEquals(user.getBirthday(), result.getBirthday());
        assertEquals(user.getGender(), result.getGender());
        assertEquals(user.getAvatarUrl(), result.getAvatarUrl());
        assertEquals(user.getExp(), result.getExp());
    }
}
