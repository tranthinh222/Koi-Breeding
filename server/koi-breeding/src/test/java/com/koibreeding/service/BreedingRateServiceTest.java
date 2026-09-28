package com.koibreeding.service;

import java.math.BigDecimal;
import java.util.List;

import com.koibreeding.domain.BreedingRate;
import com.koibreeding.domain.Dictionary;
import com.koibreeding.domain.Variety;
import com.koibreeding.enums.BreedingRecipeType;
import com.koibreeding.repository.BreedingRateRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BreedingRateServiceTest {
    @Mock private BreedingRateRepository repository;
    @Mock private DictionaryService dictionaryService;
    @InjectMocks private BreedingRateService service;

    @ParameterizedTest
    @ValueSource(ints = {1, 2})
    void missingPairReturnsBothParentsWithRequestedRates(int motherId) {
        Dictionary father = parent(1);
        Dictionary mother = motherId == 1 ? father : parent(motherId);
        when(dictionaryService.handleFetchDictionaryById(1)).thenReturn(father);
        if (motherId != 1) when(dictionaryService.handleFetchDictionaryById(motherId)).thenReturn(mother);

        List<BreedingRate> rates = service.findPairIncludingReverse(1, motherId);

        assertEquals(2, rates.size());
        assertSame(father, rates.get(0).getChild());
        assertSame(mother, rates.get(1).getChild());
        assertEquals(new BigDecimal("0.5"), rates.get(0).getFatherRate());
        assertEquals(BigDecimal.ZERO, rates.get(0).getMotherRate());
        assertEquals(BigDecimal.ZERO, rates.get(1).getFatherRate());
        assertEquals(new BigDecimal("0.5"), rates.get(1).getMotherRate());
        for (BreedingRate rate : rates) {
            assertNull(rate.getId());
            assertSame(father, rate.getFather());
            assertSame(mother, rate.getMother());
            assertEquals(new BigDecimal("0.5"), rate.getTargetRate());
            assertEquals(0, BigDecimal.ONE.compareTo(
                    rate.getTargetRate().add(rate.getFatherRate()).add(rate.getMotherRate())));
            assertEquals(motherId == 1 ? BreedingRecipeType.PURE : BreedingRecipeType.CROSS, rate.getType());
        }
        verify(repository, never()).save(any());
    }

    @Test
    void directRecipeTakesPrecedence() {
        List<BreedingRate> stored = List.of(new BreedingRate());
        when(repository.findByFatherIdAndMotherId(1, 2)).thenReturn(stored);
        assertSame(stored, service.findPairIncludingReverse(1, 2));
        verify(repository, never()).findByFatherIdAndMotherId(2, 1);
        verifyNoInteractions(dictionaryService);
    }

    @Test
    void reverseRecipeTakesPrecedenceOverDefaults() {
        List<BreedingRate> stored = List.of(new BreedingRate());
        when(repository.findByFatherIdAndMotherId(1, 2)).thenReturn(List.of());
        when(repository.findByFatherIdAndMotherId(2, 1)).thenReturn(stored);
        assertSame(stored, service.findPairIncludingReverse(1, 2));
        verifyNoInteractions(dictionaryService);
    }

    @Test
    void missingParentIsNotTreatedAsAValidPair() {
        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> service.findPairIncludingReverse(1, 2));
        assertEquals(HttpStatus.NOT_FOUND, error.getStatusCode());
        verify(repository, never()).save(any());
    }

    private Dictionary parent(int id) {
        Dictionary dictionary = new Dictionary();
        dictionary.setId(id);
        dictionary.setVariety(new Variety(id, "Variety " + id, ""));
        return dictionary;
    }
}
