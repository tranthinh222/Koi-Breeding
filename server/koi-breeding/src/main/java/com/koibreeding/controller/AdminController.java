package com.koibreeding.controller;

import com.koibreeding.dto.request.AdminModerationUserRequest;
import com.koibreeding.dto.request.ReqAdminItems;
import com.koibreeding.dto.response.ResTradeDto;
import com.koibreeding.dto.response.ResTransactionDto;
import com.koibreeding.dto.response.admin.AdminDashboardDto;
import com.koibreeding.dto.response.admin.AdminUserDto;
import com.koibreeding.dto.response.ResultPaginationDTO;
import com.koibreeding.enums.EffectType;
import com.koibreeding.enums.ItemType;
import com.koibreeding.enums.TransactionStatus;
import com.koibreeding.enums.TransactionType;
import com.koibreeding.service.AdminService;
import com.koibreeding.service.UserService;
import com.koibreeding.util.annotation.ApiMessage;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<AdminUserDto> updateUser(@Valid @RequestBody AdminModerationUserRequest request) {
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

    @GetMapping("/items")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<ReqAdminItems>> getItems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) ItemType itemType,
            @RequestParam(required = false) EffectType effectType,
            @RequestParam(required = false) String sortPrice
    ) {
        return ResponseEntity.ok(
                adminService.getAdminItems(
                        page,
                        size,
                        search,
                        itemType,
                        effectType,
                        sortPrice
                )
        );
    }

    @PostMapping("/items/addition")
    public ResponseEntity<ReqAdminItems> addItem(
            @RequestBody ReqAdminItems items
    ){
        return ResponseEntity.ok(adminService.addItem(items));
    }

    @PatchMapping("/items/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReqAdminItems> updateItem(
            @PathVariable Integer id,
            @RequestBody ReqAdminItems request
    ) {
        return ResponseEntity.ok(
                adminService.updateItem(id, request)
        );
    }
    @DeleteMapping("/items/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteItem(
            @PathVariable Integer id
    ) {
        adminService.deleteItem(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/transaction")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<ResTransactionDto>> getTransaction(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) TransactionType transactionType,
            @RequestParam(required = false) TransactionStatus transactionStatus,
            @RequestParam(required = false) String sortPrice
    ) {
        return ResponseEntity.ok(
                adminService.getAdminTransaction(
                        page,
                        size,
                        search,
                        transactionType,
                        transactionStatus,
                        sortPrice
                )
        );
    }

    @GetMapping("/trade")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<ResTradeDto>> getTrade(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String dateFilter,
            @RequestParam(required = false) String priceFilter
    ) {
        return ResponseEntity.ok(
                adminService.getAdminTrade(
                        page,
                        size,
                        search,
                        dateFilter,
                        priceFilter
                )
        );
    }
}