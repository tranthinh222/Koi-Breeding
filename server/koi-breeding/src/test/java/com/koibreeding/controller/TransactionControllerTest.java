package com.koibreeding.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import com.koibreeding.domain.User;
import com.koibreeding.dto.response.ResTransactionDto;
import com.koibreeding.dto.response.ResultPaginationDTO;
import com.koibreeding.enums.TransactionStatus;
import com.koibreeding.enums.TransactionType;
import com.koibreeding.service.TransactionService;

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
    void initData() {
        user = new User();
        user.setId(1);

        createdAt = OffsetDateTime.of(
                2026, 8, 14,
                21, 56, 42, 0,
                ZoneOffset.ofHours(7));

        resTransactionDto = new ResTransactionDto(
                1,
                1,
                "Food",
                new BigDecimal("100.0"),
                TransactionType.BUY_FOOD,
                TransactionStatus.SUCCESSED,
                "Koi Food",
                createdAt);
        resTransactionDto1 = new ResTransactionDto(
                2,
                1,
                "Fish",
                new BigDecimal("50.0"),
                TransactionType.BUY_FISH,
                TransactionStatus.SUCCESSED,
                "Koi Fish",
                createdAt);

    }

    @Test
    void getTransactions_success() {
        // given
        Pageable pageable = PageRequest.of(0, 10);
        String filter = "ALL";

        // Khởi tạo ResultPaginationDTO giả lập
        ResultPaginationDTO mockResult = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();
        meta.setPage(1);
        meta.setPageSize(10);
        meta.setTotalElements(2);
        meta.setTotalPages(1);
        mockResult.setMeta(meta);
        mockResult.setResult(List.of(resTransactionDto, resTransactionDto1));

        // Mock service gọi đúng 3 tham số
        when(transactionService.getTransactions(1, filter, pageable)).thenReturn(mockResult);

        // when (Lưu ý: giả định Controller của bạn cũng đã cập nhật nhận 3 tham số)
        ResponseEntity<ResultPaginationDTO> response = transactionController.getTransactions(1, filter,
                pageable);

        // then
        ResultPaginationDTO responseBody = response.getBody();
        @SuppressWarnings("unchecked")
        List<ResTransactionDto> result = (List<ResTransactionDto>) responseBody.getResult();

        assertEquals(2, result.size());
        assertEquals(1, responseBody.getMeta().getPage());

        assertEquals(1, resTransactionDto.getId());
        assertEquals("Food", resTransactionDto.getItemName());
        assertEquals(1, resTransactionDto.getItemId());
        assertEquals(BigDecimal.valueOf(100.0), resTransactionDto.getAmount());
        assertEquals(TransactionType.BUY_FOOD, resTransactionDto.getTransactionType());
        assertEquals("Koi Food", resTransactionDto.getDescription());
        assertEquals(createdAt, resTransactionDto.getCreatedAt());

        assertEquals(2, resTransactionDto1.getId());
        assertEquals("Fish", resTransactionDto1.getItemName());
        assertEquals(1, resTransactionDto1.getItemId());
        assertEquals(BigDecimal.valueOf(50.0), resTransactionDto1.getAmount());
        assertEquals(TransactionType.BUY_FISH, resTransactionDto1.getTransactionType());
        assertEquals("Koi Fish", resTransactionDto1.getDescription());
        assertEquals(createdAt, resTransactionDto1.getCreatedAt());
    }

}
