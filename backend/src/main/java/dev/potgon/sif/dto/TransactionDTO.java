package dev.potgon.sif.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZonedDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionDTO {
    private Long id;
    private PeriodDTO period;
    private LocalDate date;
    private BigDecimal amount;
    private String description;
    private CategoryDTO category;
    private SubcategoryDTO subcategory;
    private Boolean isRecurring;
    private String notes;
    private ZonedDateTime createdAt;
    private UserDTO user;
}
