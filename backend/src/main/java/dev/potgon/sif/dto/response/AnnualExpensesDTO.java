package dev.potgon.sif.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnnualExpensesDTO {
    private int year;
    private BigDecimal[] totalExpenses;
}