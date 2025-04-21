package dev.potgon.sif.dto.refactor;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionCreateDTO {
    private Long monthId;
    private LocalDate date;
    private BigDecimal amount;
    private String description;
    private Long categoryId;
    private Long subcategoryId;
    private Boolean isRecurring;
    private String notes;
}
