package com.koibreeding.dto.response;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import com.koibreeding.enums.TransactionStatus;
import com.koibreeding.enums.TransactionType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@AllArgsConstructor
public class ResTransactionDto{
    private Integer id;
    private Integer itemId;
    private String itemName;
    private BigDecimal amount;
    private TransactionType transactionType;
    private TransactionStatus status;
    private String description;
    private OffsetDateTime createdAt;
}
