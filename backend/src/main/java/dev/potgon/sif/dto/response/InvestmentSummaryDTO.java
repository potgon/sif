package dev.potgon.sif.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvestmentSummaryDTO {
    private BigDecimal totalInvested;
    private BigDecimal totalCurrentValue;
    private BigDecimal totalNetProfit;
    private BigDecimal totalProfitability;
    private List<AssetDTO> assets;
    private List<PerformancePeriodDTO> quarterlyPerformance;
    private List<PerformancePeriodDTO> yearlyPerformance;
}

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class PerformancePeriodDTO {
    private String period;
    private BigDecimal invested;
    private BigDecimal currentValue;
    private BigDecimal profit;
    private BigDecimal profitability;
}
