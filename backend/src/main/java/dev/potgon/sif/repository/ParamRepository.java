package dev.potgon.sif.repository;

import dev.potgon.sif.entity.Param;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParamRepository extends JpaRepository<Param, Long> {
    Param findByName(String name);
}
