package dev.potgon.sif.repository;

import dev.potgon.sif.dto.TransactionTypeEnum;
import dev.potgon.sif.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    @Query("""
        SELECT COALESCE(SUM(t.amount), 0)
        FROM Transaction t
        JOIN Category c ON t.categoryId = c.id
        JOIN TransactionType tt ON c.transactionTypeId = tt.id
        WHERE tt.name = :type AND FUNCTION('YEAR', t.date) = :year AND FUNCTION('MONTH', t.date) = :month
    """)
    BigDecimal sumByTypeAndMonth(
            @Param("type") TransactionTypeEnum type,
            @Param("year") int year,
            @Param("month") int month
    );
}
