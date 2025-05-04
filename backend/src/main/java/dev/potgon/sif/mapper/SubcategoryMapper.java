package dev.potgon.sif.mapper;

import dev.potgon.sif.dto.SubcategoryDTO;
import dev.potgon.sif.entity.Subcategory;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SubcategoryMapper {
    SubcategoryDTO toDTO(Subcategory subcategory);
    Subcategory toEntity(SubcategoryDTO subcategoryDTO);
}
