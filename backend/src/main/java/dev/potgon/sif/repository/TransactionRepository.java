package dev.potgon.sif.repository;

import dev.potgon.sif.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findAllByPeriodAndCategoryAndUserOrderByDateDesc(Period period, Category category, User user);
    List<Transaction> findAllByPeriodAndSubcategoryAndUser(Period period, Subcategory subcategory, User user);

}
