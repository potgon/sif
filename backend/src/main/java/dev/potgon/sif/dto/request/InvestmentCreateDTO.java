package dev.potgon.sif.dto.request;

import dev.potgon.sif.entity.Investment;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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
public class InvestmentCreateDTO {
    @NotNull(message = "Asset ID is required")
    private Long assetId;

    @NotNull(message = "Transaction type is required")
    private Investment.TransactionType transactionType;

    @NotNull(message = "Transaction date is required")
    private LocalDate transactionDate;

    @NotNull(message = "Amount invested is required")
    @Positive(message = "Amount invested must be positive")
    private BigDecimal amountInvested;

    private BigDecimal sharesQuantity;

    private BigDecimal pricePerShare;

    @NotBlank(message = "Currency is required")
    private String currency;

    private BigDecimal exchangeRate;

    private BigDecimal fees;

    private String notes;
}
