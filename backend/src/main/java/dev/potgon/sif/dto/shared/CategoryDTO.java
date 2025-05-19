package dev.potgon.sif.dto.shared;

import dev.potgon.sif.dto.enums.CategoryTypeEnum;
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
