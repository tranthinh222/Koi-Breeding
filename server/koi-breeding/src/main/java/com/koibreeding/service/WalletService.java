package com.koibreeding.service;

import com.koibreeding.domain.Wallet;
import com.koibreeding.dto.response.ResWalletDto;
import com.koibreeding.repository.UserRepository;
import com.koibreeding.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class WalletService {
    private final WalletRepository walletRepository;
    private final UserRepository userRepository;

    public Wallet handleCreateWallet(Wallet wallet) {
        return walletRepository.save(wallet);
    }

    @Transactional
    public ResWalletDto getBalanceWallet(Integer userId) {
        Wallet balanceWallet = getOrCreateWallet(userId);

        return new ResWalletDto(
                balanceWallet.getBalance());
    }

    @Transactional
    public Wallet deduct(Integer userId, BigDecimal amount) {
        validateAmount(amount);
        Wallet wallet = getOrCreateWallet(userId);
        if (wallet.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance");
        }
        wallet.setBalance(
                wallet.getBalance().subtract(amount));

        return walletRepository.save(wallet);
    }

    @Transactional
    public Wallet credit(Integer userId, BigDecimal amount) {
        validateAmount(amount);
        Wallet wallet = getOrCreateWallet(userId);
        wallet.setBalance(wallet.getBalance().add(amount));
        return walletRepository.save(wallet);
    }

    private Wallet getOrCreateWallet(Integer userId) {
        return walletRepository.findByUserId(userId)
                .orElseGet(() -> {
                    var user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found"));
                    Wallet newWallet = new Wallet();
                    newWallet.setUser(user);
                    newWallet.setBalance(BigDecimal.ZERO);
                    return walletRepository.save(newWallet);
                });
    }

    private void validateAmount(BigDecimal amount) {
        if (amount == null || amount.signum() <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");
        }
    }
}
