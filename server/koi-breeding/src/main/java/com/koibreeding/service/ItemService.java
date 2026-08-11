package com.koibreeding.service;

import com.koibreeding.domain.Item;
import com.koibreeding.domain.User;
import com.koibreeding.repository.ItemRepository;
import com.koibreeding.repository.UserRepository;
import lombok.Setter;
import org.springframework.stereotype.Service;

@Service
public class ItemService {
    private final ItemRepository itemRepository;
    public ItemService(ItemRepository itemRepository){

        this.itemRepository = itemRepository;
    }

    public Item handleFetchItem(Integer itemId){

        return itemRepository.findById(itemId).orElse(null);
    }
}
