package com.koibreeding.service;

import com.koibreeding.domain.Transaction;
import com.koibreeding.repository.TransactionRepository;
import org.springframework.stereotype.Service;

@Service
public class TransactionService {
    private final TransactionRepository transactionRepository;
    public TransactionService(TransactionRepository transactionRepository){
        this.transactionRepository = transactionRepository;
    }

    public Transaction handleCreateTransaction(Transaction transaction){
        return transactionRepository.save(transaction);
    }
}
