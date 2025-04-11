package dev.potgon.sif.dto;

import dev.potgon.sif.entity.CategoryType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDTO {
    private Long id;
    
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotNull(message = "Type is required")
    private CategoryType type;
    
    @NotNull(message = "Objective percentage is required")
    @Min(value = 0, message = "Objective percentage must be at least 0")
    @Max(value = 100, message = "Objective percentage must be at most 100")
    private BigDecimal objectivePercentage;
}
