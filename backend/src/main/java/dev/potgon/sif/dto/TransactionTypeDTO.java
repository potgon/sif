package dev.potgon.sif.dto;

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
