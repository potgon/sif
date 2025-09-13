package dev.potgon.sif.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "investments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Investment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false)
    private TransactionType transactionType;

    @Column(name = "transaction_date", nullable = false)
    private LocalDate transactionDate;

    @Column(name = "amount_invested", precision = 12, scale = 2, nullable = false)
    private BigDecimal amountInvested;

    @Column(name = "shares_quantity", precision = 10, scale = 6)
    private BigDecimal sharesQuantity;

    @Column(name = "price_per_share", precision = 12, scale = 4)
    private BigDecimal pricePerShare;

    @Column(name = "currency", nullable = false)
    private String currency;

    @Column(name = "exchange_rate", precision = 8, scale = 4)
    private BigDecimal exchangeRate;

    @Column(name = "fees", precision = 10, scale = 2)
    private BigDecimal fees;

    @Column(name = "notes")
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt;

    @Column(name = "updated_at")
    private java.time.LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = java.time.LocalDateTime.now();
        updatedAt = java.time.LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = java.time.LocalDateTime.now();
    }

    public enum TransactionType {
        BUY,
        SELL,
        DIVIDEND,
        SPLIT
    }
}
