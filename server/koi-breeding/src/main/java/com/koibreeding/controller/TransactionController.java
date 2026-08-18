package com.koibreeding.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.koibreeding.dto.response.ResTransactionDto;
import com.koibreeding.service.TransactionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class TransactionController {
    private final TransactionService transactionService;

    @GetMapping("/users/{userId}/transactions")
    public ResponseEntity<List<ResTransactionDto>> getTransactions(@PathVariable Integer userId) {
        return ResponseEntity.ok(transactionService.getTransactions(userId));
    }
}
