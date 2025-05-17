package dev.potgon.sif.service;

import dev.potgon.sif.dto.SubcategoryDTO;

import java.util.List;

public interface SubcategoryService {
    List<SubcategoryDTO> fetchAllSubcategoriesByUser();
}
