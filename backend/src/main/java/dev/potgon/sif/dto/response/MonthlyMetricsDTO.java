package dev.potgon.sif.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthlyMetricsDTO {
    private Long monthId;
    private Integer year;
    private Integer month;
    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal expenseTarget;
    private BigDecimal prevMonthIncome;
    private BigDecimal prevMonthExpenses;
}
