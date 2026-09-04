package com.koibreeding.repository;

import com.koibreeding.domain.Trade;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.OffsetDateTime;
import java.util.List;

public interface TradeRepository extends JpaRepository<Trade, Integer> {
    long countByTradeAtBetween(OffsetDateTime start, OffsetDateTime end);

    List<Trade> findAllByOrderByPriceDesc(Pageable pageable);
}