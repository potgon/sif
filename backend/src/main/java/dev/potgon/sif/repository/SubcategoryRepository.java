package dev.potgon.sif.repository;

import dev.potgon.sif.entity.Subcategory;
import dev.potgon.sif.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubcategoryRepository extends JpaRepository<Subcategory, Long> {
    Optional<Subcategory> findByNameAndUser(String name, User user);
    List<Subcategory> findAllByUser(User user);
}
