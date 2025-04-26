package dev.potgon.sif.entity;

import dev.potgon.sif.dto.BalanceType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "balance_snapshot")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BalanceSnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private BalanceType type;

    @Column(name = "current_amount")
    private BigDecimal currentAmount;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

}
