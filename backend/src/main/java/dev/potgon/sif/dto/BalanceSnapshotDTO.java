package dev.potgon.sif.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BalanceSnapshotDTO {

    private Long id;
    private BalanceType type;
    private BigDecimal currentAmount;
    private LocalDateTime lastUpdated;
}
