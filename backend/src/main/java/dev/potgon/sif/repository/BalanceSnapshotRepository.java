package dev.potgon.sif.repository;

import dev.potgon.sif.dto.BalanceType;
import dev.potgon.sif.entity.BalanceSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BalanceSnapshotRepository extends JpaRepository<BalanceSnapshot, Long> {
    BalanceSnapshot findBalanceSnapshotByType(BalanceType type);
}
