package dev.potgon.sif.service;

import dev.potgon.sif.dto.response.AnnualExpensesDTO;
import dev.potgon.sif.dto.response.MonthlyMetricsDTO;
import dev.potgon.sif.dto.response.MonthlyTransactionsDTO;

public interface MetricsService {
    MonthlyMetricsDTO getMonthlyMetrics(int year, int month);
    AnnualExpensesDTO getAnnualExpenses(int year);
    MonthlyTransactionsDTO getMonthlyTransactions(int year, int month);
}
