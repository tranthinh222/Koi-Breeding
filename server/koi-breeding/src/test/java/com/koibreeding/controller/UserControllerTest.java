package com.koibreeding.controller;

import com.koibreeding.domain.User;
import com.koibreeding.dto.response.ResUserDto;
import com.koibreeding.enums.Gender;
import com.koibreeding.service.UserService;
import com.koibreeding.util.error.IdInvalidException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {
    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

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
    void getUserById_success() throws IdInvalidException {
        //GIVEN
        when(userService.handleFetchUserById(1))
                .thenReturn(user);
        when(userService.convertToResUserDto(user))
                .thenReturn(resUserDto);
        //WHEN
        ResponseEntity<ResUserDto> result = userController.getUserById(1);

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertEquals(resUserDto, result.getBody());
    }

    @Test
    void getUserById_NotFoundId() throws IdInvalidException {
        //GIVEN
        when(userService.handleFetchUserById(null))
                .thenReturn(null);
        //WHEN + THEN
        IdInvalidException exception = assertThrows(
          IdInvalidException.class,
                ()-> userController.getUserById(null)
        );

        assertEquals("User with id null not found",exception.getMessage());

    }
}
