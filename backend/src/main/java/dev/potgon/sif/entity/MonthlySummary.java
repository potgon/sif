package dev.potgon.sif.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "monthly_summaries", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "month", "year"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MonthlySummary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Integer month;

    @Column(nullable = false)
    private Integer year;

    @Column(nullable = false)
    private BigDecimal totalIncome;

    @Column(nullable = false)
    private BigDecimal totalExpense;

    @Column(nullable = false)
    private BigDecimal totalInversion;

    @Column(nullable = false)
    private BigDecimal expensePercentage;

    @Column(nullable = false)
    private BigDecimal inversionPercentage;

    @Column(nullable = false)
    private BigDecimal surplus;

    @Column(nullable = false)
    private BigDecimal accumulated;

    @Column(nullable = false)
    private LocalDateTime lastRevision;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
