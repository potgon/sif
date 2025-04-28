package dev.potgon.sif.repository;

import dev.potgon.sif.entity.Subcategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubcategoryRepository extends JpaRepository<Subcategory, Long> {
    Subcategory findByName(String name);
}
