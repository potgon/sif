package dev.potgon.sif.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class YearlyOverviewDTO {
    private Integer year;
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal totalInversion;
    private List<MonthlyDataDTO> monthlySummaries;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyDataDTO {
        private Integer month;
        private String monthName;
        private BigDecimal income;
        private BigDecimal expense;
        private BigDecimal inversion;
        private BigDecimal surplus;
        private BigDecimal accumulated;
    }
}
