package dev.potgon.sif.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryDTO {
    private BigDecimal income;
    private BigDecimal expenseObjective;
    private BigDecimal expenseActual;
    private BigDecimal inversionObjective;
    private BigDecimal inversionActual;
    private BigDecimal surplus;
    private BigDecimal accumulated;
    private List<TransactionResponseDTO> recentTransactions;
}
