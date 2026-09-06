package com.koibreeding.repository;

import com.koibreeding.domain.Koi;
import com.koibreeding.domain.Marketplace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface MarketRepository extends JpaRepository<Marketplace, Integer>,
        JpaSpecificationExecutor<Marketplace> {

    List<Marketplace> findBySellerId(Integer userId);
    Optional<Marketplace> findBySellerIdAndKoiId(Integer userId, Integer koiId);
}
