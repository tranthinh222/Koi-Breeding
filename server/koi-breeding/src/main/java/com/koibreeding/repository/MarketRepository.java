package com.koibreeding.repository;

import com.koibreeding.domain.Marketplace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface MarketRepository extends JpaRepository<Marketplace, Integer>,
        JpaSpecificationExecutor<Marketplace> {
}
