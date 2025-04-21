package dev.potgon.sif.service;

import dev.potgon.sif.dto.response.MonthlyMetricsDTO;

public interface MetricsService {
    MonthlyMetricsDTO getMonthlyMetrics(int year, int month);
}
