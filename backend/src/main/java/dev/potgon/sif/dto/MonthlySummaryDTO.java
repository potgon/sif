package dev.potgon.sif.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlySummaryDTO {
    private Long id;
    
    @NotNull(message = "Month is required")
    @Min(value = 1, message = "Month must be between 1 and 12")
    @Max(value = 12, message = "Month must be between 1 and 12")
    private Integer month;
    
    @NotNull(message = "Year is required")
    @Min(value = 2000, message = "Year must be at least 2000")
    private Integer year;
    
    @NotNull(message = "Total income is required")
    private BigDecimal totalIncome;
    
    @NotNull(message = "Total expense is required")
    private BigDecimal totalExpense;
    
    @NotNull(message = "Total inversion is required")
    private BigDecimal totalInversion;
    
    @NotNull(message = "Expense percentage is required")
    private BigDecimal expensePercentage;
    
    @NotNull(message = "Inversion percentage is required")
    private BigDecimal inversionPercentage;
    
    @NotNull(message = "Surplus is required")
    private BigDecimal surplus;
    
    @NotNull(message = "Accumulated is required")
    private BigDecimal accumulated;
    
    @NotNull(message = "Last revision is required")
    private LocalDateTime lastRevision;
}
