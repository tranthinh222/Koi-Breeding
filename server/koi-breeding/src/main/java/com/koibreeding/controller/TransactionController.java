package com.koibreeding.controller;

import java.util.List;

import com.koibreeding.dto.response.ResultPaginationDTO;
import com.koibreeding.util.annotation.ApiMessage;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.koibreeding.dto.response.ResTransactionDto;
import com.koibreeding.service.TransactionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
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
