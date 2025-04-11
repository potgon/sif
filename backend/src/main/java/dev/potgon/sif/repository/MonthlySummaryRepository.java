package dev.potgon.sif.repository;

import dev.potgon.sif.entity.MonthlySummary;
import dev.potgon.sif.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MonthlySummaryRepository extends JpaRepository<MonthlySummary, Long> {
    List<MonthlySummary> findByUserOrderByYearDescMonthDesc(User user);
    Optional<MonthlySummary> findByUserAndYearAndMonth(User user, Integer year, Integer month);
    List<MonthlySummary> findByUserAndYearOrderByMonthAsc(User user, Integer year);
}
