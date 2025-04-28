package dev.potgon.sif.service;

import dev.potgon.sif.dto.response.*;

public interface MetricsService {
    MonthlyMetricsDTO getMonthlyMetrics(int year, int month);
    AnnualExpensesDTO getAnnualExpenses(int year);
    MonthlyTransactionsDTO getMonthlyTransactions(int year, int month);
    MonthlyTargetDTO getMonthlyTarget(int year, int month);
    MonthlyTransactionsDTO getMonthlyTransactionBySubcategory(int year, int month, String subcategory);
    MonthlySubcategoryExpenseDTO getMonthlyTransactionSubcategorySum(int year, int month);
}
