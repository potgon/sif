package dev.potgon.sif.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionFilterDTO {
    private LocalDate startDate;
    private LocalDate endDate;
    private Long categoryId;
    private Long subcategoryId;
    private BigDecimal minAmount;
    private BigDecimal maxAmount;
    private String description;
}
