package com.koibreeding.service;

import com.koibreeding.domain.Inventory;
import com.koibreeding.domain.Item;
import com.koibreeding.domain.Transaction;
import com.koibreeding.domain.Wallet;
import com.koibreeding.enums.ItemType;
import com.koibreeding.enums.TransactionStatus;
import com.koibreeding.enums.TransactionType;
import com.koibreeding.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.val;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

@Service
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
