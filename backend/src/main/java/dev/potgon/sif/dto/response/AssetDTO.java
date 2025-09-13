package dev.potgon.sif.dto.response;

import dev.potgon.sif.entity.Asset;
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
public class AssetDTO {
    private Long id;
    private String name;
    private String isin;
    private String symbol;
    private Asset.AssetType assetType;
    private String currency;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Calculated fields
    private BigDecimal totalInvested;
    private BigDecimal currentValue;
    private BigDecimal currentPrice;
    private BigDecimal netProfit;
    private BigDecimal profitability;
    private BigDecimal totalShares;
    private BigDecimal averagePrice;
    private LocalDate lastValueDate;
}
