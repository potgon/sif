package dev.potgon.sif.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryDTO {
    private Long id;
    private CategoryTypeEnum categoryType;
}
