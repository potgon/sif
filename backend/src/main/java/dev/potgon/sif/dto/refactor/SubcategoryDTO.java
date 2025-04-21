package dev.potgon.sif.dto.refactor;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubcategoryDTO {
    private Long id;
    private String name;
    private Long categoryId;
}
