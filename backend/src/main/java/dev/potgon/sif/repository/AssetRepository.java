package dev.potgon.sif.repository;

import dev.potgon.sif.entity.Asset;
import dev.potgon.sif.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {
    List<Asset> findByUserOrderByNameAsc(User user);
    
    Optional<Asset> findByIdAndUser(Long id, User user);
    
    Optional<Asset> findByIsinAndUser(String isin, User user);
    
    @Query("SELECT a FROM Asset a WHERE a.user = :user AND LOWER(a.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Asset> findByNameContainingIgnoreCaseAndUser(@Param("name") String name, @Param("user") User user);
}
