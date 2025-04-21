package dev.potgon.sif.dto.refactor;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthDTO {
    private Long id;
    private Integer year;
    private Integer month;
    private BigDecimal startingBalance;
    private BigDecimal expenseTarget;
}
