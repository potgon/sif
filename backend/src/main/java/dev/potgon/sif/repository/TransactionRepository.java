package dev.potgon.sif.repository;

import dev.potgon.sif.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;


public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    // Existing queries with proper ordering
    List<Transaction> findAllByPeriodAndCategoryAndUserOrderByDateDesc(Period period, Category category, User user);
    List<Transaction> findAllByPeriodAndSubcategoryAndUserOrderByDateDesc(Period period, Subcategory subcategory, User user);
    
    // New optimized queries for better index usage
    List<Transaction> findAllByPeriodAndUserOrderByDateDesc(Period period, User user);
    
    // Additional optimized queries for specific use cases
    List<Transaction> findAllByPeriodAndCategoryOrderByDateDesc(Period period, Category category);
    List<Transaction> findAllByPeriodAndSubcategoryOrderByDateDesc(Period period, Subcategory subcategory);
    
    // Optimized aggregation queries for metrics
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.period = :period AND t.category = :category AND t.user = :user")
    BigDecimal sumAmountByPeriodAndCategoryAndUser(@Param("period") Period period, @Param("category") Category category, @Param("user") User user);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.period = :period AND t.user = :user")
    BigDecimal sumAmountByPeriodAndUser(@Param("period") Period period, @Param("user") User user);
    
    // Additional optimized queries for reporting
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.period = :period AND t.user = :user")
    Long countByPeriodAndUser(@Param("period") Period period, @Param("user") User user);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.period = :period AND t.category = :category AND t.user = :user")
    Long countByPeriodAndCategoryAndUser(@Param("period") Period period, @Param("category") Category category, @Param("user") User user);
}
