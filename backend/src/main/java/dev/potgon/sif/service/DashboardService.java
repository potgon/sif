package dev.potgon.sif.service;

import dev.potgon.sif.dto.response.DashboardSummaryDTO;
import dev.potgon.sif.dto.response.MonthlyComparisonDTO;
import dev.potgon.sif.dto.response.YearlyOverviewDTO;

import java.util.List;

public interface DashboardService {
    DashboardSummaryDTO getDashboardSummary();
    List<MonthlyComparisonDTO> getMonthlyComparison();
    YearlyOverviewDTO getYearlyOverview(Integer year);
}
