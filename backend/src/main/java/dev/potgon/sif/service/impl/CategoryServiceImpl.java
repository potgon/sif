package dev.potgon.sif.service.impl;

import dev.potgon.sif.dto.CategoryDTO;
import dev.potgon.sif.entity.Category;
import dev.potgon.sif.entity.Transaction;
import dev.potgon.sif.entity.User;
import dev.potgon.sif.exception.ResourceNotFoundException;
import dev.potgon.sif.repository.CategoryRepository;
import dev.potgon.sif.repository.TransactionRepository;
import dev.potgon.sif.service.CategoryService;
import dev.potgon.sif.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final TransactionRepository transactionRepository;
    private final UserService userService;

    @Override
    @Transactional(readOnly = true)
    public List<CategoryDTO> getAllCategories() {
        User user = userService.getDefaultUser();
        return categoryRepository.findByUserOrderByNameAsc(user).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryDTO getCategoryById(Long id) {
        User user = userService.getDefaultUser();
        Category category = categoryRepository.findByUserAndId(user, id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        return mapToDTO(category);
    }

    @Override
    @Transactional
    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        User user = userService.getDefaultUser();
        
        // Check if category with same name already exists
        if (categoryRepository.existsByUserAndName(user, categoryDTO.getName())) {
            throw new IllegalArgumentException("Category with this name already exists");
        }
        
        Category category = mapToEntity(categoryDTO);
        category.setUser(user);
        Category savedCategory = categoryRepository.save(category);
        return mapToDTO(savedCategory);
    }

    @Override
    @Transactional
    public CategoryDTO updateCategory(Long id, CategoryDTO categoryDTO) {
        User user = userService.getDefaultUser();
        Category category = categoryRepository.findByUserAndId(user, id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        
        // Check if another category with the new name already exists
        if (!category.getName().equals(categoryDTO.getName()) && 
                categoryRepository.existsByUserAndName(user, categoryDTO.getName())) {
            throw new IllegalArgumentException("Another category with this name already exists");
        }
        
        category.setName(categoryDTO.getName());
        category.setType(categoryDTO.getType());
        category.setObjectivePercentage(categoryDTO.getObjectivePercentage());
        
        Category updatedCategory = categoryRepository.save(category);
        return mapToDTO(updatedCategory);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        User user = userService.getDefaultUser();
        Category category = categoryRepository.findByUserAndId(user, id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        
        // Check if category has transactions
        List<Transaction> transactions = transactionRepository.findByUserAndCategoryOrderByDateDesc(user, category);
        if (!transactions.isEmpty()) {
            throw new IllegalStateException("Cannot delete category with transactions. Delete or reassign transactions first.");
        }
        
        categoryRepository.delete(category);
    }
    
    private CategoryDTO mapToDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setType(category.getType());
        dto.setObjectivePercentage(category.getObjectivePercentage());
        return dto;
    }
    
    private Category mapToEntity(CategoryDTO dto) {
        Category category = new Category();
        category.setName(dto.getName());
        category.setType(dto.getType());
        category.setObjectivePercentage(dto.getObjectivePercentage());
        return category;
    }
}
