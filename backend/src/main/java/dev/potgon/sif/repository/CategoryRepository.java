package dev.potgon.sif.repository;


import dev.potgon.sif.entity.Category;
import dev.potgon.sif.entity.CategoryType;
import dev.potgon.sif.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByUserOrderByNameAsc(User user);
    Optional<Category> findByUserAndId(User user, Long id);
    boolean existsByUserAndName(User user, String name);
    Optional<Category> findByUserAndName(User user, String name);
    List<Category> findByUserAndType(User user, CategoryType type);
}
