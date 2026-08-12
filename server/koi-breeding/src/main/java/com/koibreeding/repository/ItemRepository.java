package com.koibreeding.repository;

import com.koibreeding.domain.Item;
import com.koibreeding.enums.ItemType;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemRepository extends JpaRepository<Item, Integer> {
    Page<Item> findByItemType(ItemType itemType, Pageable pageable);
}
