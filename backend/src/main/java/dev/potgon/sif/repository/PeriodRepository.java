package dev.potgon.sif.repository;

import dev.potgon.sif.entity.Period;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PeriodRepository extends JpaRepository<Period, Long> {
    Period findByYearAndMonth(Integer year, Integer month);
}

