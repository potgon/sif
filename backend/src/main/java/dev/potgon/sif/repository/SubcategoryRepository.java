package dev.potgon.sif.repository;

import dev.potgon.sif.entity.Category;
import dev.potgon.sif.entity.Subcategory;
import dev.potgon.sif.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubcategoryRepository extends JpaRepository<Subcategory, Long> {
    List<Subcategory> findByUserOrderByNameAsc(User user);
    List<Subcategory> findByCategoryOrderByNameAsc(Category category);
    Optional<Subcategory> findByUserAndId(User user, Long id);
    boolean existsByCategoryAndName(Category category, String name);
    Optional<Subcategory> findByCategoryAndName(Category category, String name);
}
