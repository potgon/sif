package dev.potgon.sif.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssetValueUpdateDTO {
    @NotNull(message = "Asset ID is required")
    private Long assetId;

    @NotNull(message = "Current value is required")
    private BigDecimal currentValue;

    private BigDecimal currentPrice;

    @NotNull(message = "Value date is required")
    private LocalDate valueDate;

    private String source;

    private String notes;
}
