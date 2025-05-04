package dev.potgon.sif.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionCreateDTO {
    private int year;
    private int month;
    private LocalDate date;
    private BigDecimal amount;
    private String description;
    private CategoryTypeEnum category;
    private String subcategoryName;
    private Boolean isRecurring;
    private String notes;
}
