package dev.potgon.sif.controller;

import dev.potgon.sif.dto.SubcategoryDTO;
import dev.potgon.sif.dto.response.DeleteDTO;
import dev.potgon.sif.service.SubcategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping()
    public ResponseEntity<SubcategoryDTO> createSubcategory(
            @RequestParam String name
    ) {
        return ResponseEntity.ok(subcategoryService.createSubcategory(name));
    }

    @PatchMapping()
    public ResponseEntity<SubcategoryDTO> updateSubcategory(
            @RequestBody SubcategoryDTO dto
    ) {
        return ResponseEntity.ok(subcategoryService.updateSubcategory(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<DeleteDTO> deleteSubcategory(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(subcategoryService.deleteSubcategory(id));
    }
}
