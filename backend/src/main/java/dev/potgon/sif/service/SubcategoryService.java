package dev.potgon.sif.service;

import dev.potgon.sif.dto.SubcategoryDTO;

import java.util.List;

public interface SubcategoryService {
    List<SubcategoryDTO> getAllSubcategories();
    List<SubcategoryDTO> getSubcategoriesByCategory(Long categoryId);
    SubcategoryDTO getSubcategoryById(Long id);
    SubcategoryDTO createSubcategory(SubcategoryDTO subcategoryDTO);
    SubcategoryDTO updateSubcategory(Long id, SubcategoryDTO subcategoryDTO);
    void deleteSubcategory(Long id);
}
