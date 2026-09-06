package com.koibreeding.service;

import com.koibreeding.domain.Transaction;
import com.koibreeding.dto.response.ResTransactionDto;
import com.koibreeding.dto.response.ResultPaginationDTO;
import com.koibreeding.enums.TransactionType;
import com.koibreeding.repository.TransactionRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final TransactionRepository transactionRepository;

    public Transaction handleCreateTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    public ResultPaginationDTO getTransactions(Integer userId, String filter, Pageable pageable) {
        Page<Transaction> transactionPage = switch (filter.toUpperCase()) {
            case "BOUGHT" -> transactionRepository.findByWalletUserIdAndTransactionTypeIn(
                    userId,
                    List.of(TransactionType.BUY_FOOD, TransactionType.BUY_FISH),
                    pageable);
            case "SOLD" -> transactionRepository.findByWalletUserIdAndTransactionTypeIn(
                    userId,
                    List.of(TransactionType.DEPOSIT, TransactionType.SELL_FISH),
                    pageable);
            default -> transactionRepository.findByWalletUserId(userId, pageable);
        };
        List<ResTransactionDto> transactions = transactionPage.getContent().stream()
                .map(this::toDto)
                .toList();

        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();
        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setTotalPages(transactionPage.getTotalPages());
        meta.setTotalElements(transactionPage.getTotalElements());

        ResultPaginationDTO result = new ResultPaginationDTO();
        result.setMeta(meta);
        result.setResult(transactions);
        return result;
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
