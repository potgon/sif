package dev.potgon.sif.service;

import dev.potgon.sif.dto.SubcategoryDTO;
import dev.potgon.sif.dto.response.*;
import dev.potgon.sif.dto.TransactionDTO;

import java.util.List;

public interface TransactionsService {
    MonthlyTransactionsDTO getMonthlyTransactions(int year, int month);
    MonthlyTransactionsDTO getMonthlyTransactionBySubcategory(int year, int month, String subcategory);
    MonthlySubcategoryExpenseDTO getMonthlyTransactionSubcategorySum(int year, int month);
    TransactionDTO createTransaction(TransactionCreateDTO transactionCreateDTO);
    TransactionDeleteDTO deleteTransaction(Long id);
    TransactionDTO updateTransaction(TransactionUpdateDTO updateDTO);
    List<SubcategoryDTO> fetchAllSubcategoriesByUser();
}
