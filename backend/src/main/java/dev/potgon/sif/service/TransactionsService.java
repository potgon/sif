package dev.potgon.sif.service;

import dev.potgon.sif.dto.response.MonthlySubcategoryExpenseDTO;
import dev.potgon.sif.dto.response.MonthlyTransactionsDTO;

public interface TransactionsService {
    MonthlyTransactionsDTO getMonthlyTransactions(int year, int month);
    MonthlyTransactionsDTO getMonthlyTransactionBySubcategory(int year, int month, String subcategory);
    MonthlySubcategoryExpenseDTO getMonthlyTransactionSubcategorySum(int year, int month);
}
