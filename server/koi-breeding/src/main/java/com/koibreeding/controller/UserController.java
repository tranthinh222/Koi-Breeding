package com.koibreeding.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.koibreeding.domain.User;
import com.koibreeding.dto.response.ResUserDto;
import com.koibreeding.service.UserService;
import com.koibreeding.util.annotation.ApiMessage;
import com.koibreeding.util.error.IdInvalidException;
import org.springframework.http.HttpStatus;

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
}
