package dev.potgon.sif.controller;

import dev.potgon.sif.dto.SubcategoryDTO;
import dev.potgon.sif.service.SubcategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/subcategory")
@RequiredArgsConstructor
public class SubcategoryController {

    private final SubcategoryService subcategoryService;

    @GetMapping()
    public ResponseEntity<List<SubcategoryDTO>> fetchAllSubcategories() {
        return ResponseEntity.ok(subcategoryService.fetchAllSubcategoriesByUser());
    }
}
