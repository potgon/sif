package dev.potgon.sif.service;

import dev.potgon.sif.dto.TransactionDTO;
import dev.potgon.sif.dto.response.*;

public interface TransactionsService {
    MonthlyTransactionsDTO getMonthlyTransactions(int year, int month);
    MonthlyTransactionsDTO getMonthlyTransactionBySubcategory(int year, int month, String subcategory);
    MonthlySubcategoryExpenseDTO getMonthlyTransactionSubcategorySum(int year, int month);
    TransactionDTO createTransaction(TransactionCreateDTO transactionCreateDTO);
    DeleteDTO deleteTransaction(Long id);
    TransactionDTO updateTransaction(TransactionUpdateDTO updateDTO);
}
