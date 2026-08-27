package com.koibreeding.controller;

import com.koibreeding.domain.Transaction;
import com.koibreeding.domain.User;
import com.koibreeding.dto.response.ResTransactionDto;
import com.koibreeding.dto.response.ResultPaginationDTO;
import com.koibreeding.enums.TransactionStatus;
import com.koibreeding.enums.TransactionType;
import com.koibreeding.service.TransactionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class TransactionControllerTest {
    @Mock
    private TransactionService transactionService;

    @InjectMocks
    private TransactionController transactionController;

    private ResTransactionDto resTransactionDto;
    private ResTransactionDto resTransactionDto1;
    private User user;
    private OffsetDateTime createdAt;

    @BeforeEach
    void initData(){
        user = new User();
        user.setId(1);

         createdAt =
                OffsetDateTime.of(
                        2026, 8, 14,
                        21, 56, 42, 0,
                        ZoneOffset.ofHours(7)
                );

        resTransactionDto = new ResTransactionDto(
                1,
                1,
                "Food",
                new BigDecimal("100.0"),
                TransactionType.BUY_FOOD,
                TransactionStatus.SUCCESSED,
                "Koi Food",
                createdAt
        );
        resTransactionDto1 = new ResTransactionDto(
                2,
                1,
                "Fish",
                new BigDecimal("50.0"),
                TransactionType.BUY_FISH,
                TransactionStatus.SUCCESSED,
                "Koi Fish",
                createdAt
        );


    }

    @Test
    void getTransactions_success(){
        Pageable pageable = PageRequest.of(0, 10);
        ResultPaginationDTO pagination = new ResultPaginationDTO();
        pagination.setResult(List.of(resTransactionDto, resTransactionDto1));
        //given
        when(transactionService.getTransactions(1, pageable))
                .thenReturn(pagination);
        //when
        ResponseEntity<ResultPaginationDTO> result =
                transactionController.getTransactions(1, pageable);
        assertEquals(2, ((List<?>) result.getBody().getResult()).size());

        assertEquals(1,resTransactionDto.getId());
        assertEquals("Food", resTransactionDto.getItemName());
        assertEquals(1, resTransactionDto.getItemId());
        assertEquals(BigDecimal.valueOf(100.0), resTransactionDto.getAmount());
        assertEquals(TransactionType.BUY_FOOD, resTransactionDto.getTransactionType());
        assertEquals("Koi Food", resTransactionDto.getDescription());
        assertEquals(createdAt, resTransactionDto.getCreatedAt());

        assertEquals(2,resTransactionDto1.getId());
        assertEquals("Fish", resTransactionDto1.getItemName());
        assertEquals(1, resTransactionDto1.getItemId());
        assertEquals(BigDecimal.valueOf(50.0), resTransactionDto1.getAmount());
        assertEquals(TransactionType.BUY_FISH, resTransactionDto1.getTransactionType());
        assertEquals("Koi Fish", resTransactionDto1.getDescription());
        assertEquals(createdAt, resTransactionDto1.getCreatedAt());
    }

}
