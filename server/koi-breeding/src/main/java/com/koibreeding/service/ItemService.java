package com.koibreeding.service;

import org.springframework.stereotype.Service;

import com.koibreeding.domain.Item;
import com.koibreeding.repository.ItemRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ItemService {
    private final ItemRepository itemRepository;

    public Item findItemById(Integer id) {
        return this.itemRepository.findById(id).orElse(null);

    }

}
