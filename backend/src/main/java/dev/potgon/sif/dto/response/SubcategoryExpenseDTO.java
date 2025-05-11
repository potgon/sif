package dev.potgon.sif.dto.response;

import dev.potgon.sif.dto.SubcategoryDTO;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubcategoryExpenseDTO {
    private SubcategoryDTO subcategory;
    private BigDecimal amount;
    private boolean isRecurrent;
}
