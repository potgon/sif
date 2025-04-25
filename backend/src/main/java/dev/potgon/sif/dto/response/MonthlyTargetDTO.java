package dev.potgon.sif.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthlyTargetDTO {
    private BigDecimal currentExpensePercentage;
    private BigDecimal targetExpense;
    private BigDecimal currentExpense;
    private BigDecimal surplus;
    private BigDecimal accumulated;
}
