package dev.potgon.sif.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyComparisonDTO {
    private String name;
    private BigDecimal expenses;
    private BigDecimal inversions;
}
