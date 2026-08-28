package com.koibreeding.controller;

import com.koibreeding.dto.response.ResultPaginationDTO;
import com.koibreeding.service.UserService;
import com.koibreeding.util.annotation.ApiMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {
    private final UserService userService;

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    @ApiMessage("Fetch all users for admin")
    public ResponseEntity<ResultPaginationDTO> getAllUsers(Pageable pageable) {
        return ResponseEntity.ok(userService.handleFetchAllUsers(pageable));
    }
}