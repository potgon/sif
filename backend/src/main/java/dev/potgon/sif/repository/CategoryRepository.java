package dev.potgon.sif.repository;

import dev.potgon.sif.dto.enums.CategoryTypeEnum;
import dev.potgon.sif.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Category findByName(CategoryTypeEnum name);
}
