package dev.potgon.sif.service;

import dev.potgon.sif.dto.SubcategoryDTO;
import dev.potgon.sif.dto.TransactionCreateDTO;
import dev.potgon.sif.dto.TransactionDTO;
import dev.potgon.sif.dto.TransactionUpdateDTO;
import dev.potgon.sif.dto.response.MonthlySubcategoryExpenseDTO;
import dev.potgon.sif.dto.response.MonthlyTransactionsDTO;

import java.util.List;

public interface TransactionsService {
    MonthlyTransactionsDTO getMonthlyTransactions(int year, int month);
    MonthlyTransactionsDTO getMonthlyTransactionBySubcategory(int year, int month, String subcategory);
    MonthlySubcategoryExpenseDTO getMonthlyTransactionSubcategorySum(int year, int month);
    void createTransaction(TransactionCreateDTO transactionCreateDTO);
    void deleteTransaction(Long id);
    TransactionDTO updateTransaction(TransactionUpdateDTO updateDTO);
    List<SubcategoryDTO> fetchAllSubcategories();
}
