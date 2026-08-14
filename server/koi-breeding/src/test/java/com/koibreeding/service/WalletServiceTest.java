package com.koibreeding.service;

import com.koibreeding.domain.User;
import com.koibreeding.domain.Wallet;
import com.koibreeding.dto.response.ResWalletDto;
import com.koibreeding.repository.UserRepository;
import com.koibreeding.repository.WalletRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WalletServiceTest {

    @Mock
    private WalletRepository walletRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private WalletService walletService;

    private User user;
    private Wallet wallet;

    @BeforeEach
    void initData() {
        user = new User();
        user.setId(1);

        wallet = new Wallet();
        wallet.setId(1);
        wallet.setUser(user);
        wallet.setBalance(new BigDecimal("100.0"));
    }

    @Test
    void handleCreateWallet_success() {
        // GIVEN
        when(walletRepository.save(wallet)).thenReturn(wallet);

        // WHEN
        Wallet result = walletService.handleCreateWallet(wallet);

        // THEN
        assertNotNull(result);
        assertEquals(wallet, result);
        verify(walletRepository).save(wallet);
    }

    @Test
    void getBalanceWallet_walletExists_success() {
        // GIVEN
        when(walletRepository.findByUserId(1)).thenReturn(Optional.of(wallet));

        // WHEN
        ResWalletDto result = walletService.getBalanceWallet(1);

        // THEN
        assertNotNull(result);
        assertEquals(new BigDecimal("100.0"), result.getBalance());

        verify(walletRepository).findByUserId(1);
        verifyNoInteractions(userRepository);
        verify(walletRepository, never()).save(any());
    }

    @Test
    void getBalanceWallet_walletNotExists_shouldCreateNewWallet() {
        // GIVEN
        when(walletRepository.findByUserId(1)).thenReturn(Optional.empty());
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(walletRepository.save(any(Wallet.class))).thenAnswer(invocation -> {
            Wallet newWallet = invocation.getArgument(0);
            newWallet.setId(2);
            return newWallet;
        });

        // WHEN
        ResWalletDto result = walletService.getBalanceWallet(1);

        // THEN
        assertNotNull(result);
        assertEquals(0, BigDecimal.ZERO.compareTo(result.getBalance()));

        verify(userRepository).findById(1);
        verify(walletRepository).save(any(Wallet.class));
    }

    @Test
    void getBalanceWallet_userNotFound_shouldThrowException() {
        // GIVEN
        when(walletRepository.findByUserId(1)).thenReturn(Optional.empty());
        when(userRepository.findById(1)).thenReturn(Optional.empty());

        // WHEN + THEN
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> walletService.getBalanceWallet(1)
        );

        assertEquals("User not found", exception.getMessage());
        verify(walletRepository, never()).save(any());
    }

    @Test
    void deduct_success() {
        // GIVEN
        when(walletRepository.findByUserId(1)).thenReturn(Optional.of(wallet));
        when(walletRepository.save(any(Wallet.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // WHEN
        Wallet result = walletService.deduct(1, new BigDecimal("30.0"));

        // THEN
        assertNotNull(result);
        assertEquals(0, new BigDecimal("70.0").compareTo(result.getBalance()));
        verify(walletRepository).save(wallet);
    }

    @Test
    void deduct_insufficientBalance_shouldThrowException() {
        // GIVEN
        when(walletRepository.findByUserId(1)).thenReturn(Optional.of(wallet));

        // WHEN + THEN
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> walletService.deduct(1, new BigDecimal("200.0"))
        );

        assertEquals("Insufficient balance", exception.getMessage());
        verify(walletRepository, never()).save(any());
    }

    @Test
    void deduct_negativeAmount_shouldThrowIllegalArgumentException() {
        // WHEN + THEN
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> walletService.deduct(1, new BigDecimal("-10.0"))
        );

        assertEquals("Amount must be greater than zero", exception.getMessage());
        verifyNoInteractions(walletRepository);
    }

    @Test
    void deduct_zeroAmount_shouldThrowIllegalArgumentException() {
        // WHEN + THEN
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> walletService.deduct(1, BigDecimal.ZERO)
        );

        assertEquals("Amount must be greater than zero", exception.getMessage());
        verifyNoInteractions(walletRepository);
    }

    @Test
    void deduct_nullAmount_shouldThrowIllegalArgumentException() {
        // WHEN + THEN
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> walletService.deduct(1, null)
        );

        assertEquals("Amount must be greater than zero", exception.getMessage());
        verifyNoInteractions(walletRepository);
    }

    @Test
    void credit_success() {
        // GIVEN
        when(walletRepository.findByUserId(1)).thenReturn(Optional.of(wallet));
        when(walletRepository.save(any(Wallet.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // WHEN
        Wallet result = walletService.credit(1, new BigDecimal("50.0"));

        // THEN
        assertNotNull(result);
        assertEquals(0, new BigDecimal("150.0").compareTo(result.getBalance()));
        verify(walletRepository).save(wallet);
    }

    @Test
    void credit_walletNotExists_shouldCreateThenCredit() {
        // GIVEN
        when(walletRepository.findByUserId(1)).thenReturn(Optional.empty());
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(walletRepository.save(any(Wallet.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // WHEN
        Wallet result = walletService.credit(1, new BigDecimal("20.0"));

        // THEN
        assertNotNull(result);
        assertEquals(0, new BigDecimal("20.0").compareTo(result.getBalance()));
        verify(walletRepository, times(2)).save(any(Wallet.class));
    }

    @Test
    void credit_negativeAmount_shouldThrowIllegalArgumentException() {
        // WHEN + THEN
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> walletService.credit(1, new BigDecimal("-5.0"))
        );

        assertEquals("Amount must be greater than zero", exception.getMessage());
        verifyNoInteractions(walletRepository);
    }

    @Test
    void credit_nullAmount_shouldThrowIllegalArgumentException() {
        // WHEN + THEN
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> walletService.credit(1, null)
        );

        assertEquals("Amount must be greater than zero", exception.getMessage());
        verifyNoInteractions(walletRepository);
    }
}