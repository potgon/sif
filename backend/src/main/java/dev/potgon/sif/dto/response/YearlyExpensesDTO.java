package dev.potgon.sif.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class YearlyExpensesDTO {
    private Integer year;
    private Integer month;
    private BigDecimal totalExpenses;
}