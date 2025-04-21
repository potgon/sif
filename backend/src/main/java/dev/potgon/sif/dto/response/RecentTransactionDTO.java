package dev.potgon.sif.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecentTransactionDTO {
    private Long id;
    private LocalDate date;
    private BigDecimal amount;
    private String description;
    private String category;
    private String subcategory;
    private String type;
    private String color;
}
