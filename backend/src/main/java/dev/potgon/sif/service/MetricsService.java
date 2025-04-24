package dev.potgon.sif.service;

import dev.potgon.sif.dto.response.AnnualExpensesDTO;
import dev.potgon.sif.dto.response.MonthlyMetricsDTO;

public interface MetricsService {
    MonthlyMetricsDTO getMonthlyMetrics(int year, int month);
    AnnualExpensesDTO getAnnualExpenses(int year);
}
