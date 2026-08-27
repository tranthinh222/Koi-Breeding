package com.koibreeding.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.koibreeding.dto.response.ResultPaginationDTO;
import com.koibreeding.service.TransactionService;
import com.koibreeding.util.annotation.ApiMessage;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class TransactionController {
    private final TransactionService transactionService;

    @ApiMessage("Get transaction history with pagination")
    @GetMapping("/users/{userId}/transactions")
    public ResponseEntity<ResultPaginationDTO> getTransactions(
            @PathVariable Integer userId,
            @RequestParam(defaultValue = "ALL") String filter,
            Pageable pageable) {
        return ResponseEntity.ok(transactionService.getTransactions(userId, filter, pageable));
    }
}
