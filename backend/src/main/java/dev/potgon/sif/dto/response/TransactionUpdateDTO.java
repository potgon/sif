package dev.potgon.sif.dto.response;

import dev.potgon.sif.dto.SubcategoryDTO;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionUpdateDTO {
    private Long id;
    private LocalDate date;
    private BigDecimal amount;
    private String description;
    private SubcategoryDTO subcategory;
    private Boolean isRecurring;
    private String notes;
}
