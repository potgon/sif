package dev.potgon.sif.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionRowDTO {
    private Long id;
    private BigDecimal amount;
    private LocalDate date;
    private boolean isRecurring;
    private SubcategoryDTO subcategory;
}
