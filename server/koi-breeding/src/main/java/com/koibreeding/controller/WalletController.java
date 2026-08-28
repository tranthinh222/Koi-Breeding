package com.koibreeding.controller;

import com.koibreeding.dto.response.ResWalletDto;
import com.koibreeding.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
@CrossOrigin(originPatterns = { "http://localhost:*", "http://127.0.0.1:*", "http://127.0.0.2:*" })
public class WalletController {
    private final WalletService walletService;

    @GetMapping("/wallet/{userId}")
    public ResponseEntity<ResWalletDto> getBalance(@PathVariable Integer userId) {
        return ResponseEntity.ok(walletService.getBalanceWallet(userId));
    }
}
