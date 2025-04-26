package dev.potgon.sif.entity;

import dev.potgon.sif.dto.BalanceAction;
import dev.potgon.sif.dto.BalanceType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "balance_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BalanceHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private BalanceType type;

    @Enumerated(EnumType.STRING)
    private BalanceAction action;

    private BigDecimal amount;

    private String note;

    private LocalDateTime timestamp;

    @ManyToOne
    private Period sourcePeriod;
}
