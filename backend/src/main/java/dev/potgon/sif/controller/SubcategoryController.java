package dev.potgon.sif.controller;

import dev.potgon.sif.dto.SubcategoryDTO;
import dev.potgon.sif.service.SubcategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/subcategories")
@RequiredArgsConstructor
public class SubcategoryController {

    private final SubcategoryService subcategoryService;
    
    @GetMapping
    public ResponseEntity<List<SubcategoryDTO>> getAllSubcategories() {
        return ResponseEntity.ok(subcategoryService.getAllSubcategories());
    }
    
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<SubcategoryDTO>> getSubcategoriesByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(subcategoryService.getSubcategoriesByCategory(categoryId));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<SubcategoryDTO> getSubcategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(subcategoryService.getSubcategoryById(id));
    }
    
    @PostMapping
    public ResponseEntity<SubcategoryDTO> createSubcategory(@Valid @RequestBody SubcategoryDTO subcategoryDTO) {
        return new ResponseEntity<>(subcategoryService.createSubcategory(subcategoryDTO), HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<SubcategoryDTO> updateSubcategory(@PathVariable Long id, @Valid @RequestBody SubcategoryDTO subcategoryDTO) {
        return ResponseEntity.ok(subcategoryService.updateSubcategory(id, subcategoryDTO));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubcategory(@PathVariable Long id) {
        subcategoryService.deleteSubcategory(id);
        return ResponseEntity.noContent().build();
    }
}
