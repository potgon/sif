package dev.potgon.sif.dto.response;

import dev.potgon.sif.entity.Investment;
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
public class InvestmentDTO {
    private Long id;
    private Long assetId;
    private String assetName;
    private Investment.TransactionType transactionType;
    private LocalDate transactionDate;
    private BigDecimal amountInvested;
    private BigDecimal sharesQuantity;
    private BigDecimal pricePerShare;
    private String currency;
    private BigDecimal exchangeRate;
    private BigDecimal fees;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
