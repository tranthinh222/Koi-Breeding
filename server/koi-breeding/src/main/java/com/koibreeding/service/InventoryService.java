package com.koibreeding.service;

import com.koibreeding.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.val;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {
        private final InventoryRepository inventoryRepository;

}
