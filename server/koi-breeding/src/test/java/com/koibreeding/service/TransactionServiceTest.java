package com.koibreeding.service;

import com.koibreeding.domain.Item;
import com.koibreeding.domain.Transaction;
import com.koibreeding.domain.User;
import com.koibreeding.domain.Wallet;
import com.koibreeding.dto.response.ResTransactionDto;
import com.koibreeding.dto.response.ResultPaginationDTO;
import com.koibreeding.enums.TransactionStatus;
import com.koibreeding.enums.TransactionType;
import com.koibreeding.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

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
        Pageable pageable = PageRequest.of(0, 10);
        // given
        when(transactionRepository.findByWalletUserId(user.getId(), pageable))
                .thenReturn(new PageImpl<>(List.of(transaction1, transaction2), pageable, 2));

        // when
        ResultPaginationDTO result = transactionService.getTransactions(user.getId(), "ALL", pageable);
        @SuppressWarnings("unchecked")
        List<ResTransactionDto> transactions = (List<ResTransactionDto>) result.getResult();

        // then
        assertThat(transactions).hasSize(2);
        assertThat(result.getMeta().getPage()).isEqualTo(1);
        assertThat(result.getMeta().getPageSize()).isEqualTo(10);
        assertThat(result.getMeta().getTotalElements()).isEqualTo(2);

        ResTransactionDto dto1 = transactions.get(0);
        assertThat(dto1.getId()).isEqualTo(1);
        assertThat(dto1.getItemId()).isEqualTo(1);
        assertThat(dto1.getItemName()).isEqualTo("Food");
        assertThat(dto1.getAmount()).isEqualByComparingTo("100.0");
        assertThat(dto1.getTransactionType()).isEqualTo(TransactionType.BUY_FOOD);
        assertThat(dto1.getStatus()).isEqualTo(TransactionStatus.SUCCESSED);
        assertThat(dto1.getDescription()).isEqualTo("Koi Food");
        assertThat(dto1.getCreatedAt()).isEqualTo(createdAt);

        ResTransactionDto dto2 = transactions.get(1);
        assertThat(dto2.getItemName()).isEqualTo("Fish");
    }

    @Test
    void getTransactions_shouldPaginateFilteredTransactions() {
        Pageable pageable = PageRequest.of(0, 1);
        List<TransactionType> boughtTypes = List.of(TransactionType.BUY_FOOD, TransactionType.BUY_FISH);
        when(transactionRepository.findByWalletUserIdAndTransactionTypeIn(
                user.getId(), boughtTypes, pageable))
                .thenReturn(new PageImpl<>(List.of(transaction1), pageable, 2));

        ResultPaginationDTO result = transactionService.getTransactions(user.getId(), "BOUGHT", pageable);

        assertThat(result.getMeta().getTotalElements()).isEqualTo(2);
        assertThat(result.getMeta().getTotalPages()).isEqualTo(2);
        assertThat(result.getMeta().getPage()).isEqualTo(1);
    }

    @Test
    void getTransactions_shouldReturnUnknownItem_whenItemIsNull() {
        Pageable pageable = PageRequest.of(0, 10);
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

        when(transactionRepository.findByWalletUserId(user.getId(), pageable))
                .thenReturn(new PageImpl<>(List.of(txWithoutItem), pageable, 1));

        // when
        ResultPaginationDTO result = transactionService.getTransactions(user.getId(), "ALL", pageable);
        @SuppressWarnings("unchecked")
        List<ResTransactionDto> transactions = (List<ResTransactionDto>) result.getResult();

        // then
        assertThat(transactions).hasSize(1);
        assertThat(transactions.get(0).getItemId()).isNull();
        assertThat(transactions.get(0).getItemName()).isEqualTo("Unknown item");
    }

    @Test
    void getTransactions_shouldReturnEmptyList_whenNoTransactionFound() {
        Pageable pageable = PageRequest.of(0, 10);
        // given
        when(transactionRepository.findByWalletUserId(user.getId(), pageable))
                .thenReturn(new PageImpl<>(List.of(), pageable, 0));

        // when
        ResultPaginationDTO result = transactionService.getTransactions(user.getId(), "ALL", pageable);
        @SuppressWarnings("unchecked")
        List<ResTransactionDto> transactions = (List<ResTransactionDto>) result.getResult();

        // then
        assertThat(transactions).isEmpty();
    }
}
