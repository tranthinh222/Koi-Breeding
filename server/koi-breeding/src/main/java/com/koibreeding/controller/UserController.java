package com.koibreeding.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;
import com.koibreeding.dto.request.UpdateLocationRequest;

import com.koibreeding.domain.User;
import com.koibreeding.dto.response.ResUserDto;
import com.koibreeding.service.UserService;
import com.koibreeding.util.annotation.ApiMessage;
import com.koibreeding.util.error.IdInvalidException;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1")
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

    @PatchMapping("/users/{id}/location")
    public ResponseEntity<ResUserDto> updateLocation(@PathVariable Integer id,
            @Valid @RequestBody UpdateLocationRequest request) {
        return ResponseEntity.ok(userService.updateLocation(id, request.location()));
    }

}
