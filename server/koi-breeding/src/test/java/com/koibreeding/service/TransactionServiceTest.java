package com.koibreeding.service;

import com.koibreeding.domain.Item;
import com.koibreeding.domain.Transaction;
import com.koibreeding.domain.User;
import com.koibreeding.domain.Wallet;
import com.koibreeding.dto.response.ResTransactionDto;
import com.koibreeding.enums.TransactionStatus;
import com.koibreeding.enums.TransactionType;
import com.koibreeding.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class TransactionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @InjectMocks
    private TransactionService transactionService;

    private User user;
    private Wallet wallet;
    private Item item1;
    private Item item2;
    private Transaction transaction1;
    private Transaction transaction2;
    private OffsetDateTime createdAt;

    @BeforeEach
    void initData() {
        user = new User();
        user.setId(1);

        wallet = new Wallet();
        wallet.setUser(user);

        createdAt = OffsetDateTime.of(
                2026, 8, 14,
                21, 56, 42, 0,
                ZoneOffset.ofHours(7)
        );

        item1 = new Item();
        item1.setId(1);
        item1.setName("Food");

        item2 = new Item();
        item2.setId(2);
        item2.setName("Fish");

        transaction1 = new Transaction();
        transaction1.setId(1);
        transaction1.setWallet(wallet);
        transaction1.setItem(item1);
        transaction1.setAmount(new BigDecimal("100.0"));
        transaction1.setTransactionType(TransactionType.BUY_FOOD);
        transaction1.setStatus(TransactionStatus.SUCCESSED);
        transaction1.setDescription("Koi Food");
        transaction1.setCreatedAt(createdAt);

        transaction2 = new Transaction();
        transaction2.setId(2);
        transaction2.setWallet(wallet);
        transaction2.setItem(item2);
        transaction2.setAmount(new BigDecimal("50.0"));
        transaction2.setTransactionType(TransactionType.BUY_FISH);
        transaction2.setStatus(TransactionStatus.SUCCESSED);
        transaction2.setDescription("Koi Fish");
        transaction2.setCreatedAt(createdAt);
    }

    @Test
    void getTransactions_shouldReturnListOfDto() {
        // given
        when(transactionRepository.findByWalletUserIdOrderByCreatedAtDesc(user.getId()))
                .thenReturn(List.of(transaction1, transaction2));

        // when
        List<ResTransactionDto> result = transactionService.getTransactions(user.getId());

        // then
        assertThat(result).hasSize(2);

        ResTransactionDto dto1 = result.get(0);
        assertThat(dto1.getId()).isEqualTo(1);
        assertThat(dto1.getItemId()).isEqualTo(1);
        assertThat(dto1.getItemName()).isEqualTo("Food");
        assertThat(dto1.getAmount()).isEqualByComparingTo("100.0");
        assertThat(dto1.getTransactionType()).isEqualTo(TransactionType.BUY_FOOD);
        assertThat(dto1.getStatus()).isEqualTo(TransactionStatus.SUCCESSED);
        assertThat(dto1.getDescription()).isEqualTo("Koi Food");
        assertThat(dto1.getCreatedAt()).isEqualTo(createdAt);

        ResTransactionDto dto2 = result.get(1);
        assertThat(dto2.getItemName()).isEqualTo("Fish");
    }

    @Test
    void getTransactions_shouldReturnUnknownItem_whenItemIsNull() {
        // given
        Transaction txWithoutItem = new Transaction();
        txWithoutItem.setId(3);
        txWithoutItem.setWallet(wallet);
        txWithoutItem.setItem(null);
        txWithoutItem.setAmount(new BigDecimal("20.0"));
        txWithoutItem.setTransactionType(TransactionType.BUY_FISH);
        txWithoutItem.setStatus(TransactionStatus.SUCCESSED);
        txWithoutItem.setDescription("No item tx");
        txWithoutItem.setCreatedAt(createdAt);

        when(transactionRepository.findByWalletUserIdOrderByCreatedAtDesc(user.getId()))
                .thenReturn(List.of(txWithoutItem));

        // when
        List<ResTransactionDto> result = transactionService.getTransactions(user.getId());

        // then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getItemId()).isNull();
        assertThat(result.get(0).getItemName()).isEqualTo("Unknown item");
    }

    @Test
    void getTransactions_shouldReturnEmptyList_whenNoTransactionFound() {
        // given
        when(transactionRepository.findByWalletUserIdOrderByCreatedAtDesc(user.getId()))
                .thenReturn(List.of());

        // when
        List<ResTransactionDto> result = transactionService.getTransactions(user.getId());

        // then
        assertThat(result).isEmpty();
    }
}