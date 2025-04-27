package dev.potgon.sif.service;

import dev.potgon.sif.dto.response.*;

public interface MetricsService {
    MonthlyMetricsDTO getMonthlyMetrics(int year, int month);
    AnnualExpensesDTO getAnnualExpenses(int year);
    MonthlyTransactionsDTO getMonthlyTransactions(int year, int month);
    MonthlyTargetDTO getMonthlyTarget(int year, int month);
    MonthlyTransactionRowDTO getMonthlyTransactionRow(int year, int month);
}
