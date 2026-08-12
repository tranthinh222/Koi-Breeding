package com.koibreeding.service;

import com.koibreeding.domain.Inventory;
import com.koibreeding.domain.Item;
import com.koibreeding.enums.ItemType;
import com.koibreeding.repository.*;
import lombok.RequiredArgsConstructor;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ShopService {
        private final ItemRepository itemRepository;

        public Page<Item> getItems(ItemType category, int page, int size) {
                Pageable pageable = PageRequest.of(page, size);

                Page<Item> items = category == null
                                ? itemRepository.findAll(pageable)
                                : itemRepository.findByItemType(category, pageable);

                return items;

        }

}
