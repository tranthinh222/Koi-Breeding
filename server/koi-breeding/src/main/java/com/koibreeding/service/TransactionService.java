package com.koibreeding.service;

import com.koibreeding.domain.Transaction;
import com.koibreeding.dto.response.ResTransactionDto;
import com.koibreeding.repository.TransactionRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final TransactionRepository transactionRepository;

    public Transaction handleCreateTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    public java.util.List<ResTransactionDto> getTransactions(Integer userId) {
        return transactionRepository.findByWalletUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toDto)
                .toList();
    }

    public ResTransactionDto toDto(Transaction transaction) {
        Integer itemId = transaction.getItem() != null ? transaction.getItem().getId() : null;
        String itemName = transaction.getItem() != null ? transaction.getItem().getName() : "Unknown item";
        return new ResTransactionDto(
                transaction.getId(),
                itemId,
                itemName,
                transaction.getAmount(),
                transaction.getTransactionType(),
                transaction.getStatus(),
                transaction.getDescription(),
                transaction.getCreatedAt());
    }
}
