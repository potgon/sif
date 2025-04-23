package dev.potgon.sif.repository;

import dev.potgon.sif.entity.Category;
import dev.potgon.sif.entity.Period;
import dev.potgon.sif.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findAllByPeriodAndCategoryOrderByDateDesc(Period period, Category category);
}
