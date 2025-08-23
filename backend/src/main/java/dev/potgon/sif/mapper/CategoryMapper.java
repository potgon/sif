package dev.potgon.sif.mapper;

import dev.potgon.sif.dto.shared.CategoryDTO;
import dev.potgon.sif.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    
    @Mapping(source = "categoryType", target = "name")
    Category toEntity(CategoryDTO categoryDTO);
    
    @Mapping(source = "name", target = "categoryType")
    CategoryDTO toDTO(Category category);
}
