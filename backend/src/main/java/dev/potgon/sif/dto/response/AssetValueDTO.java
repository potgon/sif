package dev.potgon.sif.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssetValueDTO {
    private Long id;
    private Long assetId;
    private String assetName;
    private BigDecimal currentPrice;
    private BigDecimal currentValue;
    private LocalDate valueDate;
    private String source;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
