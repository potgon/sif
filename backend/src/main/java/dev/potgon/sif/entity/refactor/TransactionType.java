package dev.potgon.sif.entity.refactor;

import dev.potgon.sif.dto.TransactionTypeEnum;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "transaction_types")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TransactionTypeEnum name;
}
