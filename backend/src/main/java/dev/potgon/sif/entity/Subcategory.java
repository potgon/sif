package dev.potgon.sif.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "subcategories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subcategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String name;

}