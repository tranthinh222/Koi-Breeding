package com.koibreeding.repository;

import com.koibreeding.domain.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InventoryRepository extends JpaRepository<Inventory, Integer> {
    List<Inventory> findByUserId(Integer userId);
    Optional<Inventory> findByUserIdAndItemId(Integer userId, Integer itemId);
}
