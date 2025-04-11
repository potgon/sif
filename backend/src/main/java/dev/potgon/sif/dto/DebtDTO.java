package dev.potgon.sif.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DebtDTO {
    private Long id;
    
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;
    
    private String currency = "EUR";
    
    @NotNull(message = "Is owed by user flag is required")
    private Boolean isOwedByUser;
    
    @NotBlank(message = "Person name is required")
    private String personName;
    
    private String description;
    
    private LocalDate dueDate;
    
    private Boolean isPaid = false;
}
