package dev.potgon.sif.entity.refactor;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "months")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Month {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer year;

    @Column(nullable = false)
    private Integer month;

    @Column(name = "starting_balance", nullable = false, precision = 12, scale = 2)
    private BigDecimal startingBalance;

    @Column(name = "expense_target", precision = 12, scale = 2)
    private BigDecimal expenseTarget;
}