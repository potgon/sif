package dev.potgon.sif.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "app_state")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppState {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer lastLoadedYear;
    private Integer lastLoadedMonth;
}
