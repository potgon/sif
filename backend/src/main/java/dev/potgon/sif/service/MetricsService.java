package dev.potgon.sif.service;

import dev.potgon.sif.dto.response.*;

public interface MetricsService {
    MonthlyMetricsDTO getMonthlyMetrics(int year, int month);
    AnnualExpensesDTO getAnnualExpenses(int year);
    MonthlyTargetDTO getMonthlyTarget(int year, int month);
    ExtraPayDTO getExtraPay(int year, int month);
}
