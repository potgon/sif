package dev.potgon.sif.repository;

import dev.potgon.sif.entity.Asset;
import dev.potgon.sif.entity.AssetValue;
import dev.potgon.sif.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AssetValueRepository extends JpaRepository<AssetValue, Long> {
    List<AssetValue> findByAssetAndUserOrderByValueDateDesc(Asset asset, User user);
    
    Optional<AssetValue> findFirstByAssetAndUserOrderByValueDateDesc(Asset asset, User user);
    
    Optional<AssetValue> findByAssetAndValueDateAndUser(Asset asset, LocalDate valueDate, User user);
    
    @Query("SELECT av FROM AssetValue av WHERE av.asset = :asset AND av.user = :user AND av.valueDate <= :date ORDER BY av.valueDate DESC")
    Optional<AssetValue> findLatestValueBeforeDate(@Param("asset") Asset asset, @Param("user") User user, @Param("date") LocalDate date);
}
