package dev.potgon.sif.repository;

import dev.potgon.sif.entity.Asset;
import dev.potgon.sif.entity.Investment;
import dev.potgon.sif.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface InvestmentRepository extends JpaRepository<Investment, Long> {
    List<Investment> findByAssetAndUserOrderByTransactionDateDesc(Asset asset, User user);
    
    List<Investment> findByUserOrderByTransactionDateDesc(User user);
    
    @Query("SELECT i FROM Investment i WHERE i.asset = :asset AND i.user = :user AND i.transactionType = 'BUY'")
    List<Investment> findBuyTransactionsByAssetAndUser(@Param("asset") Asset asset, @Param("user") User user);
    
    @Query("SELECT i FROM Investment i WHERE i.asset = :asset AND i.user = :user AND i.transactionType = 'SELL'")
    List<Investment> findSellTransactionsByAssetAndUser(@Param("asset") Asset asset, @Param("user") User user);
    
    @Query("SELECT i FROM Investment i WHERE i.user = :user AND i.transactionDate BETWEEN :startDate AND :endDate ORDER BY i.transactionDate DESC")
    List<Investment> findByUserAndDateRange(@Param("user") User user, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT COALESCE(SUM(CASE WHEN i.transactionType = 'BUY' THEN i.amountInvested ELSE -i.amountInvested END), 0) FROM Investment i WHERE i.asset = :asset AND i.user = :user")
    Double getTotalInvestedByAsset(@Param("asset") Asset asset, @Param("user") User user);
    
    @Query("SELECT COALESCE(SUM(i.sharesQuantity), 0) FROM Investment i WHERE i.asset = :asset AND i.user = :user AND i.transactionType = 'BUY'")
    Double getTotalSharesByAsset(@Param("asset") Asset asset, @Param("user") User user);
    
    @Query("SELECT COALESCE(SUM(i.sharesQuantity), 0) FROM Investment i WHERE i.asset = :asset AND i.user = :user AND i.transactionType = 'SELL'")
    Double getSoldSharesByAsset(@Param("asset") Asset asset, @Param("user") User user);
}
