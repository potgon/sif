package dev.potgon.sif.repository;

import dev.potgon.sif.entity.Category;
import dev.potgon.sif.entity.Subcategory;
import dev.potgon.sif.entity.Transaction;
import dev.potgon.sif.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUserOrderByDateDesc(User user);
    Optional<Transaction> findByUserAndId(User user, Long id);
    List<Transaction> findByUserAndDateBetweenOrderByDateDesc(User user, LocalDate startDate, LocalDate endDate);
    List<Transaction> findByUserAndCategoryOrderByDateDesc(User user, Category category);
    List<Transaction> findByUserAndSubcategoryOrderByDateDesc(User user, Subcategory subcategory);
    
    @Query("SELECT t FROM Transaction t WHERE t.user = ?1 AND " +
           "(?2 IS NULL OR t.date >= ?2) AND " +
           "(?3 IS NULL OR t.date <= ?3) AND " +
           "(?4 IS NULL OR t.category.id = ?4) AND " +
           "(?5 IS NULL OR t.subcategory.id = ?5) AND " +
           "(?6 IS NULL OR t.amount >= ?6) AND " +
           "(?7 IS NULL OR t.amount <= ?7) AND " +
           "(?8 IS NULL OR LOWER(t.description) LIKE LOWER(CONCAT('%', ?8, '%'))) " +
           "ORDER BY t.date DESC")
    List<Transaction> findByFilters(User user, LocalDate startDate, LocalDate endDate, 
                                   Long categoryId, Long subcategoryId, 
                                   BigDecimal minAmount, BigDecimal maxAmount, 
                                   String description);
}
