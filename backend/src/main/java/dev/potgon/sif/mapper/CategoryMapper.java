package dev.potgon.sif.mapper;

import dev.potgon.sif.dto.shared.CategoryDTO;
import dev.potgon.sif.entity.Category;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    Category toEntity(CategoryDTO categoryDTO);
    CategoryDTO toDTO(Category category);
}
