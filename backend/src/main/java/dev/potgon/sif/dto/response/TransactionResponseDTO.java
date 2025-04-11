package dev.potgon.sif.dto.response;

import dev.potgon.sif.entity.CategoryType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponseDTO {
    private Long id;
    private Long categoryId;
    private String categoryName;
    private CategoryType categoryType;
    private Long subcategoryId;
    private String subcategoryName;
    private BigDecimal amount;
    private String currency;
    private LocalDate date;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
