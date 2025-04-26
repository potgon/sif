package dev.potgon.sif.dto;

import dev.potgon.sif.entity.Period;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BalanceHistory {

    private Long id;
    private BalanceType type;
    private BalanceAction action;
    private BigDecimal amount;
    private String note;
    private LocalDateTime timestamp;
    private Period sourcePeriod;
}
