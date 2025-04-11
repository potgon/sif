package dev.potgon.sif.service.impl;

import dev.potgon.sif.dto.SubcategoryDTO;
import dev.potgon.sif.entity.Category;
import dev.potgon.sif.entity.Subcategory;
import dev.potgon.sif.entity.Transaction;
import dev.potgon.sif.entity.User;
import dev.potgon.sif.exception.ResourceNotFoundException;
import dev.potgon.sif.repository.CategoryRepository;
import dev.potgon.sif.repository.SubcategoryRepository;
import dev.potgon.sif.repository.TransactionRepository;
import dev.potgon.sif.service.SubcategoryService;
import dev.potgon.sif.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubcategoryServiceImpl implements SubcategoryService {

    private final SubcategoryRepository subcategoryRepository;
    private final CategoryRepository categoryRepository;
    private final TransactionRepository transactionRepository;
    private final UserService userService;

    @Override
    @Transactional(readOnly = true)
    public List<SubcategoryDTO> getAllSubcategories() {
        User user = userService.getDefaultUser();
        return subcategoryRepository.findByUserOrderByNameAsc(user).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubcategoryDTO> getSubcategoriesByCategory(Long categoryId) {
        User user = userService.getDefaultUser();
        Category category = categoryRepository.findByUserAndId(user, categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));
        
        return subcategoryRepository.findByCategoryOrderByNameAsc(category).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public SubcategoryDTO getSubcategoryById(Long id) {
        User user = userService.getDefaultUser();
        Subcategory subcategory = subcategoryRepository.findByUserAndId(user, id)
                .orElseThrow(() -> new ResourceNotFoundException("Subcategory", "id", id));
        return mapToDTO(subcategory);
    }

    @Override
    @Transactional
    public SubcategoryDTO createSubcategory(SubcategoryDTO subcategoryDTO) {
        User user = userService.getDefaultUser();
        
        Category category = categoryRepository.findByUserAndId(user, subcategoryDTO.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", subcategoryDTO.getCategoryId()));
        
        // Check if subcategory with same name already exists in this category
        if (subcategoryRepository.existsByCategoryAndName(category, subcategoryDTO.getName())) {
            throw new IllegalArgumentException("Subcategory with this name already exists in this category");
        }
        
        Subcategory subcategory = new Subcategory();
        subcategory.setName(subcategoryDTO.getName());
        subcategory.setCategory(category);
        subcategory.setUser(user);
        
        Subcategory savedSubcategory = subcategoryRepository.save(subcategory);
        return mapToDTO(savedSubcategory);
    }

    @Override
    @Transactional
    public SubcategoryDTO updateSubcategory(Long id, SubcategoryDTO subcategoryDTO) {
        User user = userService.getDefaultUser();
        
        Subcategory subcategory = subcategoryRepository.findByUserAndId(user, id)
                .orElseThrow(() -> new ResourceNotFoundException("Subcategory", "id", id));
        
        Category category = categoryRepository.findByUserAndId(user, subcategoryDTO.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", subcategoryDTO.getCategoryId()));
        
        // Check if another subcategory with the new name already exists in this category
        if ((!subcategory.getName().equals(subcategoryDTO.getName()) || 
                !subcategory.getCategory().getId().equals(subcategoryDTO.getCategoryId())) && 
                subcategoryRepository.existsByCategoryAndName(category, subcategoryDTO.getName())) {
            throw new IllegalArgumentException("Another subcategory with this name already exists in this category");
        }
        
        subcategory.setName(subcategoryDTO.getName());
        subcategory.setCategory(category);
        
        Subcategory updatedSubcategory = subcategoryRepository.save(subcategory);
        return mapToDTO(updatedSubcategory);
    }

    @Override
    @Transactional
    public void deleteSubcategory(Long id) {
        User user = userService.getDefaultUser();
        
        Subcategory subcategory = subcategoryRepository.findByUserAndId(user, id)
                .orElseThrow(() -> new ResourceNotFoundException("Subcategory", "id", id));
        
        // Check if subcategory has transactions
        List<Transaction> transactions = transactionRepository.findByUserAndSubcategoryOrderByDateDesc(user, subcategory);
        if (!transactions.isEmpty()) {
            throw new IllegalStateException("Cannot delete subcategory with transactions. Delete or reassign transactions first.");
        }
        
        subcategoryRepository.delete(subcategory);
    }
    
    private SubcategoryDTO mapToDTO(Subcategory subcategory) {
        SubcategoryDTO dto = new SubcategoryDTO();
        dto.setId(subcategory.getId());
        dto.setCategoryId(subcategory.getCategory().getId());
        dto.setName(subcategory.getName());
        return dto;
    }
}
