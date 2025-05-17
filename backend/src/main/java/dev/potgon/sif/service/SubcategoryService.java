package dev.potgon.sif.service;

import dev.potgon.sif.dto.SubcategoryDTO;
import dev.potgon.sif.dto.response.DeleteDTO;

import java.util.List;

public interface SubcategoryService {
    List<SubcategoryDTO> fetchAllSubcategoriesByUser();
    SubcategoryDTO createSubcategory(String name);
    SubcategoryDTO updateSubcategory(SubcategoryDTO dto);
    DeleteDTO deleteSubcategory(Long id);
}
