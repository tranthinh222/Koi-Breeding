package com.koibreeding.controller;

import com.koibreeding.dto.request.AdminUpdateUserRequest;
import com.koibreeding.dto.response.admin.AdminDashboardDto;
import com.koibreeding.dto.response.admin.AdminUserDto;
import com.koibreeding.dto.response.ResultPaginationDTO;
import com.koibreeding.service.AdminService;
import com.koibreeding.service.UserService;
import com.koibreeding.util.annotation.ApiMessage;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {
    private final UserService userService;
    private final AdminService adminService;

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    @ApiMessage("Fetch all users for admin")
    public ResponseEntity<ResultPaginationDTO> getAllUsers(Pageable pageable) {
        return ResponseEntity.ok(userService.handleFetchAllUsers(pageable));
    }

    @PutMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    @ApiMessage("Update user for admin")
    public ResponseEntity<AdminUserDto> updateUser(@Valid @RequestBody AdminUpdateUserRequest request) {
        return ResponseEntity.ok(adminService.handleUpdateUser(request));
    }

    @DeleteMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    @ApiMessage("Delete user for admin")
    public ResponseEntity<Void> deleteUser(@RequestParam Integer id) {
        adminService.handleDeleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    @ApiMessage("Fetch dashboard data for admin")
    public ResponseEntity<AdminDashboardDto> getDashboard(
            @RequestParam(defaultValue = "3") int userLimit,
            @RequestParam(defaultValue = "3") int transactionLimit) {
        return ResponseEntity.ok(adminService.handleFetchDashboard(userLimit, transactionLimit));
    }
}