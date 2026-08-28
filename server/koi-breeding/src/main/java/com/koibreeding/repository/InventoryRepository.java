package com.koibreeding.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.koibreeding.domain.Inventory;
import com.koibreeding.enums.ItemType;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Integer> {
    List<Inventory> findByUserId(Integer userId);

    Optional<Inventory> findByUserIdAndItemId(Integer userId, Integer itemId);

    List<Inventory> findByUser_IdAndItem_ItemType(Integer userId, ItemType itemType);
}
