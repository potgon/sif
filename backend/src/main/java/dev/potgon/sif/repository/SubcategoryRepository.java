package dev.potgon.sif.repository;

import dev.potgon.sif.entity.Subcategory;
import dev.potgon.sif.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubcategoryRepository extends JpaRepository<Subcategory, Long> {
    Subcategory findByNameAndUser(String name, User user);
}
