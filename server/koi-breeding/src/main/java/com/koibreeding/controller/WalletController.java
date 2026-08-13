package com.koibreeding.controller;

import com.koibreeding.dto.response.WalletResponse;
import com.koibreeding.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@CrossOrigin(originPatterns = { "http://localhost:*", "http://127.0.0.1:*", "http://127.0.0.2:*" })
public class WalletController {
    private final WalletService walletService;
    @GetMapping("/wallet")
    public ResponseEntity<WalletResponse> getBalance(
//            @PathVariable Integer userId
    ){
        Integer userId = 1;
        return ResponseEntity.ok(walletService.getBalanceWallet(userId));
    }
}
