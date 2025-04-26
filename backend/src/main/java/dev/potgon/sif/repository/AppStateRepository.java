package dev.potgon.sif.repository;

import dev.potgon.sif.entity.AppState;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppStateRepository extends JpaRepository<AppState, Long> {
    AppState findAppStateById(Long id);
}
