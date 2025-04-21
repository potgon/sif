package dev.potgon.sif.dto.refactor;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryDTO {
    private Long id;
    private String name;
    private Long transactionTypeId;
    private String color;
}
