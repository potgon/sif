package dev.potgon.sif.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "params")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Param {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "value")
    private String value;

    @Column(name = "createdAt")
    private LocalDateTime createdAt;

    /*Current params
    -Salary (€)
    -Expense Target (%)
    -Inversion Target (%)
    * */
}
