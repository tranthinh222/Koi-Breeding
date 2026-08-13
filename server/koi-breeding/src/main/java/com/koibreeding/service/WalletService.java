package com.koibreeding.service;

import com.koibreeding.domain.Wallet;
import com.koibreeding.dto.response.WalletResponse;
import com.koibreeding.repository.UserRepository;
import com.koibreeding.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class WalletService {
    private final WalletRepository walletRepository;

    public Wallet handleCreateWallet(Wallet wallet){
        return walletRepository.save(wallet);
    }

    public WalletResponse getBalanceWallet(Integer useId){
        Wallet balanceWallet = walletRepository.findByUserId(useId)
                .orElse(null);
        if(balanceWallet == null){
            throw new RuntimeException("User not wallet");
        }

        return new WalletResponse(
                balanceWallet.getBalance()
        );
    }
    public Wallet deduct(Integer userId, BigDecimal amount){
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(()->new RuntimeException("Not found wallet"));
        if(wallet.getBalance().compareTo(amount) < 0){
            throw new RuntimeException("Insufficient balance");
        }
        wallet.setBalance(
                wallet.getBalance().subtract(amount));

        Wallet walletNew = handleCreateWallet(wallet);
        return walletNew;
    }
}
