package com.koibreeding.controller;

import com.koibreeding.dto.response.ResWalletDto;
import com.koibreeding.service.WalletService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WalletControllerTest {

    @Mock
    private WalletService walletService;

    @InjectMocks
    private WalletController walletController;

    private ResWalletDto resWalletDto;

    @BeforeEach
    void initData() {
        resWalletDto = new ResWalletDto(new BigDecimal("100.0"));
    }

    @Test
    void getBalance_success() {
        // GIVEN
        when(walletService.getBalanceWallet(1))
                .thenReturn(resWalletDto);

        // WHEN
        ResponseEntity<ResWalletDto> result = walletController.getBalance(1);

        // THEN
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertEquals(new BigDecimal("100.0"), result.getBody().getBalance());

        verify(walletService).getBalanceWallet(1);
    }

    @Test
    void getBalance_zeroBalance() {
        // GIVEN
        ResWalletDto zeroBalanceDto = new ResWalletDto(BigDecimal.ZERO);
        when(walletService.getBalanceWallet(2))
                .thenReturn(zeroBalanceDto);

        // WHEN
        ResponseEntity<ResWalletDto> result = walletController.getBalance(2);

        // THEN
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertEquals(0, BigDecimal.ZERO.compareTo(result.getBody().getBalance()));

        verify(walletService).getBalanceWallet(2);
    }

    @Test
    void getBalance_userNotFound_shouldPropagateException() {
        // GIVEN
        when(walletService.getBalanceWallet(99))
                .thenThrow(new RuntimeException("User not found"));

        // WHEN + THEN
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> walletController.getBalance(99)
        );

        assertEquals("User not found", exception.getMessage());
        verify(walletService).getBalanceWallet(99);
    }
}