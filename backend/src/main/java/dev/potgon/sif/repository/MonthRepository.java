package dev.potgon.sif.repository;

import dev.potgon.sif.entity.Month;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MonthRepository extends JpaRepository<Month, Long> {
    Optional<Month> findByYearAndMonth(Integer year, Integer month);
}

