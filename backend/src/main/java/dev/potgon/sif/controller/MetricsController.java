package dev.potgon.sif.controller;

import dev.potgon.sif.dto.response.MonthlyMetricsDTO;
import dev.potgon.sif.dto.response.AnnualExpensesDTO;
import dev.potgon.sif.service.MetricsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/metrics")
@RequiredArgsConstructor
public class MetricsController {
    private final MetricsService metricsService;

    @GetMapping("/monthly")
    public ResponseEntity<MonthlyMetricsDTO> getMonthlyMetrics(
            @RequestParam int year,
            @RequestParam int month
    ) {
        return ResponseEntity.ok(metricsService.getMonthlyMetrics(year, month));
    }

    @GetMapping("/annual")
    public ResponseEntity<AnnualExpensesDTO> getAnnualExpenses(
            @RequestParam int year
    ) {
        return ResponseEntity.ok(metricsService.getAnnualExpenses(year));
    }
}

