package dev.potgon.sif.repository;

import dev.potgon.sif.entity.Param;
import dev.potgon.sif.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParamRepository extends JpaRepository<Param, Long> {
    Param findByNameAndUser(String name, User user);
}
