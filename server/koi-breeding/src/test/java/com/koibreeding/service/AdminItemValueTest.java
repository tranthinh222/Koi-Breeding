package com.koibreeding.service;

import com.koibreeding.domain.Item;
import com.koibreeding.dto.request.ReqAdminItems;
import com.koibreeding.repository.ItemRepository;
import jakarta.validation.Validation;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.web.server.ResponseStatusException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminItemValueTest {
    @Mock ItemRepository itemRepository;
    @Mock com.koibreeding.repository.DictionaryRepository dictionaryRepository;
    @InjectMocks AdminService service;

    @Test void createPersistsAndReturnsProvidedValue() {
        var request = ReqAdminItems.builder().effectValue(new BigDecimal("25.50")).build();
        var result = service.addItem(request);
        verify(itemRepository).save(argThat(item -> request.getEffectValue().equals(item.getEffectValue())));
        assertEquals(request.getEffectValue(), result.getEffectValue());
    }

    @Test void createRequiresValue() {
        assertThrows(ResponseStatusException.class, () -> service.addItem(new ReqAdminItems()));
        verifyNoInteractions(itemRepository);
    }

    @Test void patchCanSetZeroAndOmittedValuePreservesExistingValue() {
        Item item = new Item();
        item.setEffectValue(new BigDecimal("12.75"));
        when(itemRepository.findById(1)).thenReturn(Optional.of(item));
        when(itemRepository.save(item)).thenReturn(item);
        assertEquals(new BigDecimal("12.75"), service.updateItem(1, new ReqAdminItems()).getEffectValue());
        assertEquals(BigDecimal.ZERO, service.updateItem(1,
                ReqAdminItems.builder().effectValue(BigDecimal.ZERO).build()).getEffectValue());
        assertEquals(BigDecimal.ZERO, item.getEffectValue());
    }

    @Test void listReturnsValueForEditing() {
        Item item = new Item();
        item.setEffectValue(new BigDecimal("18.25"));
        when(itemRepository.findAll(org.mockito.ArgumentMatchers.<Specification<Item>>any(), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(item)));
        assertEquals(item.getEffectValue(), service.getAdminItems(0, 8, null, null, null, null)
                .getContent().get(0).getEffectValue());
    }

    @Test void koiCreateAcceptsExistingDictionary() {
        when(dictionaryRepository.existsById(12)).thenReturn(true);
        var result = service.addItem(ReqAdminItems.builder()
                .itemType(com.koibreeding.enums.ItemType.KOI).effectValue(new BigDecimal("12")).build());
        assertEquals(new BigDecimal("12"), result.getEffectValue());
        verify(dictionaryRepository).existsById(12);
    }

    @Test void koiCreateRejectsMissingAndNonIntegerDictionaryIds() {
        for (String value : List.of("99", "0", "-1", "1.5", "2147483648")) {
            assertThrows(ResponseStatusException.class, () -> service.addItem(ReqAdminItems.builder()
                    .itemType(com.koibreeding.enums.ItemType.KOI).effectValue(new BigDecimal(value)).build()));
        }
        verify(itemRepository, never()).save(any());
    }

    @Test void patchValidatesResultingTypeAndValueBeforeChangingItem() {
        Item item = new Item();
        item.setItemType(com.koibreeding.enums.ItemType.FOOD);
        item.setEffectValue(new BigDecimal("99"));
        when(itemRepository.findById(1)).thenReturn(Optional.of(item));
        assertThrows(ResponseStatusException.class, () -> service.updateItem(1, ReqAdminItems.builder()
                .itemType(com.koibreeding.enums.ItemType.KOI).build()));
        assertEquals(com.koibreeding.enums.ItemType.FOOD, item.getItemType());
        item.setItemType(com.koibreeding.enums.ItemType.KOI);
        assertThrows(ResponseStatusException.class, () -> service.updateItem(1, ReqAdminItems.builder()
                .effectValue(new BigDecimal("1.2")).build()));
        assertThrows(ResponseStatusException.class, () -> service.updateItem(1, new ReqAdminItems()));
        verify(itemRepository, never()).save(any());
        when(dictionaryRepository.existsById(12)).thenReturn(true);
        when(itemRepository.save(item)).thenReturn(item);
        assertEquals(new BigDecimal("12"), service.updateItem(1, ReqAdminItems.builder()
                .effectValue(new BigDecimal("12")).build()).getEffectValue());
    }

    @Test void valueValidationMatchesDatabasePrecision() {
        try (var factory = Validation.buildDefaultValidatorFactory()) {
            var validator = factory.getValidator();
            for (String invalid : List.of("-1", "1.001", "100000000")) {
                assertFalse(validator.validate(ReqAdminItems.builder().effectValue(new BigDecimal(invalid)).build()).isEmpty());
            }
            assertTrue(validator.validate(ReqAdminItems.builder().effectValue(new BigDecimal("99999999.99")).build()).isEmpty());
        }
    }
}
