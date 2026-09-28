package com.koibreeding.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.koibreeding.domain.Item;
import com.koibreeding.enums.ItemType;

public interface ItemRepository extends JpaRepository<Item, Integer>, JpaSpecificationExecutor<Item> {
    Page<Item> findByItemType(ItemType itemType, Pageable pageable);
}
