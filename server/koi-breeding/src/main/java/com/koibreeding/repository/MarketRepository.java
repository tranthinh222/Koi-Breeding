package com.koibreeding.repository;

import com.koibreeding.domain.Koi;
import com.koibreeding.domain.Marketplace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

public interface MarketRepository extends JpaRepository<Marketplace, Integer>,
        JpaSpecificationExecutor<Marketplace> {

    List<Marketplace> findBySellerId(Integer userId);
    Optional<Marketplace> findBySellerIdAndKoiId(Integer userId, Integer koiId);

        // Projection cho Biểu đồ Chợ giao dịch
    interface MarketplaceProjection {
        String getDate();
        Long getActive();
        Long getSold();
        Long getCancelled();
    }

    @Query("""
        SELECT FUNCTION('TO_CHAR', m.createdAt, 'DD/MM') AS date,
               SUM(CASE WHEN m.status = 'ACTIVE' THEN 1 ELSE 0 END) AS active,
               SUM(CASE WHEN m.status = 'SOLD' THEN 1 ELSE 0 END) AS sold,
               SUM(CASE WHEN m.status = 'CANCELLED' THEN 1 ELSE 0 END) AS cancelled
        FROM Marketplace m
        WHERE m.createdAt >= :startDate
        GROUP BY FUNCTION('TO_CHAR', m.createdAt, 'DD/MM')
        ORDER BY MIN(m.createdAt) ASC
    """)
    List<MarketplaceProjection> getMarketplaceStatusByDay(@Param("startDate") OffsetDateTime startDate);
}
