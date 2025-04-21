package dev.potgon.sif.dto.refactor;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionTypeDTO {
    private Long id;
    private String name;
}
