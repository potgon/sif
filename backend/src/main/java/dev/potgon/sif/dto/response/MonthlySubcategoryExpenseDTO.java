package dev.potgon.sif.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthlySubcategoryExpenseDTO {
    List<SubcategoryExpenseDTO> subcategoryExpenses;
}
