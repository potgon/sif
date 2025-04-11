package dev.potgon.sif.service;

import dev.potgon.sif.dto.TransactionDTO;
import dev.potgon.sif.dto.TransactionFilterDTO;
import dev.potgon.sif.dto.response.MonthlyTransactionsResponseDTO;
import dev.potgon.sif.dto.response.TransactionResponseDTO;

import java.util.List;

public interface TransactionService {
    List<TransactionResponseDTO> getAllTransactions();
    TransactionResponseDTO getTransactionById(Long id);
    TransactionResponseDTO createTransaction(TransactionDTO transactionDTO);
    TransactionResponseDTO updateTransaction(Long id, TransactionDTO transactionDTO);
    void deleteTransaction(Long id);
    List<TransactionResponseDTO> getFilteredTransactions(TransactionFilterDTO filterDTO);
    MonthlyTransactionsResponseDTO getMonthlyTransactions(Integer year, Integer month);
}
