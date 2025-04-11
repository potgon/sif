package dev.potgon.sif.controller;

import dev.potgon.sif.dto.response.DashboardSummaryDTO;
import dev.potgon.sif.dto.response.MonthlyComparisonDTO;
import dev.potgon.sif.dto.response.YearlyOverviewDTO;
import dev.potgon.sif.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    
    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDTO> getDashboardSummary() {
        return ResponseEntity.ok(dashboardService.getDashboardSummary());
    }
    
    @GetMapping("/monthly-comparison")
    public ResponseEntity<List<MonthlyComparisonDTO>> getMonthlyComparison() {
        return ResponseEntity.ok(dashboardService.getMonthlyComparison());
    }
    
    @GetMapping("/yearly-overview")
    public ResponseEntity<YearlyOverviewDTO> getYearlyOverview(
            @RequestParam(required = false) Integer year) {
        if (year == null) {
            year = LocalDate.now().getYear();
        }
        return ResponseEntity.ok(dashboardService.getYearlyOverview(year));
    }
}
