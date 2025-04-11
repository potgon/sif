package dev.potgon.sif.repository;


import dev.potgon.sif.entity.Debt;
import dev.potgon.sif.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DebtRepository extends JpaRepository<Debt, Long> {
    List<Debt> findByUserOrderByIsPaidAscDueDateAsc(User user);
    Optional<Debt> findByUserAndId(User user, Long id);
}
