package dev.potgon.sif.controller;

import dev.potgon.sif.dto.request.IncomeUpdateDTO;
import dev.potgon.sif.dto.response.*;
import dev.potgon.sif.service.MetricsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/monthly/target")
    public ResponseEntity<MonthlyTargetDTO> getMonthlyTarget(
            @RequestParam int year,
            @RequestParam int month
    ) {
        return ResponseEntity.ok(metricsService.getMonthlyTarget(year, month));
    }

    @GetMapping("/extra")
    public ResponseEntity<ExtraPayDTO> getExtraPay(
            @RequestParam int year,
            @RequestParam int month
    ) {
        return ResponseEntity.ok(metricsService.getExtraPay(year, month));
    }

    @PatchMapping("/income/update")
    public ResponseEntity<Void> updateIncome(
            @RequestBody IncomeUpdateDTO incomeUpdateDTO
    ) {
        metricsService.updateIncome(incomeUpdateDTO);
        return ResponseEntity.accepted().build();
    }
}

