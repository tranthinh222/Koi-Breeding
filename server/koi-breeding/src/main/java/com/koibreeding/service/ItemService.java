package com.koibreeding.service;

import com.koibreeding.domain.Item;
import com.koibreeding.domain.User;
import com.koibreeding.repository.ItemRepository;
import com.koibreeding.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ItemService {
    private final ItemRepository itemRepository;

    public Item findItemById(int id) {
        return this.itemRepository.findById(id).orElse(null);

    }
}
