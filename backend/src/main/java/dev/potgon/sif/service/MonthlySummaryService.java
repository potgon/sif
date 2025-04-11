package dev.potgon.sif.service;

import dev.potgon.sif.dto.MonthlySummaryDTO;

import java.util.List;

public interface MonthlySummaryService {
    List<MonthlySummaryDTO> getAllMonthlySummaries();
    MonthlySummaryDTO getMonthlySummaryByMonth(Integer year, Integer month);
    MonthlySummaryDTO createMonthlySummary(MonthlySummaryDTO monthlySummaryDTO);
    MonthlySummaryDTO updateMonthlySummary(Integer year, Integer month, MonthlySummaryDTO monthlySummaryDTO);
    MonthlySummaryDTO calculateMonthlySummary(Integer year, Integer month);
}
