package dev.potgon.sif.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyTransactionsResponseDTO {
    private List<TransactionResponseDTO> transactions;
    private BigDecimal totalExpense;
    private BigDecimal totalInversion;
    private Integer month;
    private Integer year;
}
