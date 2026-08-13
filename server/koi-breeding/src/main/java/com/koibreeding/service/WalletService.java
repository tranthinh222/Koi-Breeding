package com.koibreeding.service;

import com.koibreeding.domain.Wallet;
import com.koibreeding.dto.response.ResWalletDto;
import com.koibreeding.repository.UserRepository;
import com.koibreeding.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class WalletService {
    private final WalletRepository walletRepository;
    private final UserRepository userRepository;

    public Wallet handleCreateWallet(Wallet wallet) {
        return walletRepository.save(wallet);
    }

    public ResWalletDto getBalanceWallet(Integer useId) {
        Wallet balanceWallet = walletRepository.findByUserId(useId)
                .orElseGet(() -> {
                    var user = userRepository.findById(useId)
                            .orElseThrow(() -> new RuntimeException("User not found"));
                    Wallet newWallet = new Wallet();
                    newWallet.setUser(user);
                    newWallet.setBalance(BigDecimal.ZERO);
                    return walletRepository.save(newWallet);
                });

        return new ResWalletDto(
                balanceWallet.getBalance());
    }

    public Wallet deduct(Integer userId, BigDecimal amount) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Not found wallet"));
        if (wallet.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance");
        }
        wallet.setBalance(
                wallet.getBalance().subtract(amount));

        Wallet walletNew = handleCreateWallet(wallet);
        return walletNew;
    }
}
