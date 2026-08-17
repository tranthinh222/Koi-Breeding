package com.koibreeding.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.koibreeding.domain.KoiDictionary;
import com.koibreeding.domain.Variety;
import com.koibreeding.dto.response.ResultPaginationDTO;
import com.koibreeding.enums.ScaleType;
import com.koibreeding.enums.Shape;
import com.koibreeding.repository.KoiDictionaryRepository;

@ExtendWith(MockitoExtension.class)
public class KoiDictionaryServiceTest {

    @Mock
    private KoiDictionaryRepository koiDictionaryRepository;

    @Mock
    private VarietyService varietyService;

    @InjectMocks
    private KoiDictionaryService koiDictionaryService;

    @Test
    public void createKoiDictionary_shouldReturnKoiDictionary() {
        KoiDictionary inputKoiDictionary = new KoiDictionary(
                null,
                "Kohaku",
                Shape.STANDARD,
                ScaleType.WAGOI,
                new Variety(1, "Kohaku", ""),
                "Japan",
                BigDecimal.valueOf(90.0),
                BigDecimal.valueOf(0.015),
                400,
                BigDecimal.valueOf(0.000015),
                100,
                BigDecimal.valueOf(1.68), null);

        KoiDictionary outputKoiDictionary = new KoiDictionary(
                1,
                "Kohaku",
                Shape.STANDARD,
                ScaleType.WAGOI,
                new Variety(1, "Kohaku", ""),
                "Japan",
                BigDecimal.valueOf(90.0),
                BigDecimal.valueOf(0.015),
                400,
                BigDecimal.valueOf(0.000015),
                100,
                BigDecimal.valueOf(1.68), null);

        when(this.koiDictionaryRepository.save(inputKoiDictionary)).thenReturn(outputKoiDictionary);

        KoiDictionary result = this.koiDictionaryService.handleCreateKoiDictionary(inputKoiDictionary);

        assertEquals(outputKoiDictionary.getId(), result.getId());

        verify(this.koiDictionaryRepository).save(inputKoiDictionary);
    }

    @Test
    public void updateKoiDictionary_shoudReturnUpdatedKoiDictionary_whenCurrentKoiDictionaryExist() {
        Variety mockVariety = new Variety(1, "Kohaku", "");
        KoiDictionary inputKoiDictionary = new KoiDictionary(
                1,
                "Kohaku",
                Shape.STANDARD,
                ScaleType.WAGOI,
                mockVariety,
                "Japan",
                BigDecimal.valueOf(95.0), // New value
                BigDecimal.valueOf(0.015),
                400,
                BigDecimal.valueOf(0.000015),
                100,
                BigDecimal.valueOf(1.68), null);

        KoiDictionary oldKoiDictionary = new KoiDictionary(
                1,
                "Kohaku",
                Shape.STANDARD,
                ScaleType.WAGOI,
                mockVariety,
                "Japan",
                BigDecimal.valueOf(90.0), // Old value
                BigDecimal.valueOf(0.015),
                400,
                BigDecimal.valueOf(0.000015),
                100,
                BigDecimal.valueOf(1.68), null);

        when(this.koiDictionaryRepository.findById(1)).thenReturn(Optional.of(oldKoiDictionary));
        when(this.varietyService.handleFetchVarietyById(1)).thenReturn(mockVariety);
        when(this.koiDictionaryRepository.save(oldKoiDictionary)).thenReturn(oldKoiDictionary);

        KoiDictionary result = this.koiDictionaryService.handleUpdateKoiDictionary(inputKoiDictionary);

        assertEquals(inputKoiDictionary.getBaseMaxLength(), result.getBaseMaxLength());
        verify(this.koiDictionaryRepository).findById(1);
        verify(this.varietyService).handleFetchVarietyById(1);
        verify(this.koiDictionaryRepository).save(oldKoiDictionary);
    }

    @Test
    public void updateKoiDictionary_shoudReturnNull_whenCurrentKoiDictionaryNotExist() {
        Variety mockVariety = new Variety(1, "Kohaku", "");
        KoiDictionary inputKoiDictionary = new KoiDictionary(
                0, // Invalid Id
                "Kohaku",
                Shape.STANDARD,
                ScaleType.WAGOI,
                mockVariety,
                "Japan",
                BigDecimal.valueOf(95.0), // New value
                BigDecimal.valueOf(0.015),
                400,
                BigDecimal.valueOf(0.000015),
                100,
                BigDecimal.valueOf(1.68), null);

        when(this.koiDictionaryRepository.findById(0)).thenReturn(Optional.empty());

        KoiDictionary result = this.koiDictionaryService.handleUpdateKoiDictionary(inputKoiDictionary);

        assertNull(result);
        verify(this.koiDictionaryRepository).findById(0);
    }

    @Test
    public void fetchKoiDictionary_shouldReturnKoiDictionary_whenIdValid() {
        Integer validId = 1;
        Variety mockVariety = new Variety(1, "Kohaku", "");
        KoiDictionary outputKoiDictionary = new KoiDictionary(
                1,
                "Kohaku",
                Shape.STANDARD,
                ScaleType.WAGOI,
                mockVariety,
                "Japan",
                BigDecimal.valueOf(90.0),
                BigDecimal.valueOf(0.015),
                400,
                BigDecimal.valueOf(0.000015),
                100,
                BigDecimal.valueOf(1.68), null);

        when(this.koiDictionaryRepository.findById(validId)).thenReturn(Optional.of(outputKoiDictionary));

        KoiDictionary result = this.koiDictionaryService.handleFetchKoiDictionaryById(validId);

        assertEquals(outputKoiDictionary, result);

        verify(this.koiDictionaryRepository).findById(validId);
    }

    @Test
    public void fetchKoiDictionary_shouldReturnNull_whenIdInvalid() {
        Integer invalidId = 0;

        when(this.koiDictionaryRepository.findById(invalidId)).thenReturn(Optional.empty());

        KoiDictionary result = this.koiDictionaryService.handleFetchKoiDictionaryById(invalidId);

        assertNull(result);

        verify(this.koiDictionaryRepository).findById(invalidId);
    }

    @SuppressWarnings("unchecked")
    @Test
    public void fetchAllKoiDictionaries_shouldReturnResultPagination_whenHasData() {
        Variety mockVariety = new Variety(1, "Kohaku", "");
        List<KoiDictionary> mockKoiDictionaryList = new ArrayList<>();
        for (int i = 0; i < 10; ++i) {
            mockKoiDictionaryList.add(new KoiDictionary(
                    i + 1,
                    "Mock Kohaku #" + (i + 1),
                    Shape.STANDARD,
                    ScaleType.WAGOI,
                    mockVariety,
                    "Japan",
                    BigDecimal.valueOf(90.0),
                    BigDecimal.valueOf(0.015),
                    400,
                    BigDecimal.valueOf(0.000015),
                    100,
                    BigDecimal.valueOf(1.68), null));
        }

        int pageNumber = 0;
        int pageSize = 10;
        long totalElements = 50;
        Pageable inputPageable = PageRequest.of(pageNumber, pageSize);
        Page<KoiDictionary> mockPageKoiDictionary = new PageImpl<>(mockKoiDictionaryList, inputPageable, totalElements);

        when(this.koiDictionaryRepository.findAll(inputPageable)).thenReturn(mockPageKoiDictionary);

        ResultPaginationDTO result = this.koiDictionaryService.handleFetchAllKoiDictionaries(inputPageable);

        assertEquals(pageNumber + 1, result.getMeta().getPage());
        assertEquals(pageSize, result.getMeta().getPageSize());
        assertEquals((int) Math.ceil(totalElements / pageSize), result.getMeta().getTotalPages());
        assertEquals(totalElements, result.getMeta().getTotalElements());

        List<KoiDictionary> resultList = ((List<KoiDictionary>) result.getResult());
        assertEquals(mockKoiDictionaryList.size(), resultList.size());
        assertEquals(mockKoiDictionaryList.get(0).getName(), resultList.get(0).getName());
        assertEquals(mockKoiDictionaryList.get(1).getName(), resultList.get(1).getName());

        verify(this.koiDictionaryRepository).findAll(inputPageable);
    }

    @Test
    public void deleteKoiDictionary_shouldDeleteKoiDictionary_whenIdValid() {
        Integer validId = 1;

        this.koiDictionaryService.handleDeleteKoiDictionary(validId);

        verify(this.koiDictionaryRepository).deleteById(validId);
    }

    @Test
    public void checkExistById_shouldReturnTrue_whenKoiDictionaryExist() {
        Integer existId = 1;

        when(this.koiDictionaryRepository.existsById(existId)).thenReturn(true);

        boolean result = this.koiDictionaryService.isKoiDictionaryExistById(existId);

        assertEquals(true, result);

        verify(this.koiDictionaryRepository).existsById(existId);
    }

    @Test
    public void checkExistById_shouldReturnTrue_whenKoiDictionaryNotExist() {
        Integer notExistId = 1000;

        when(this.koiDictionaryRepository.existsById(notExistId)).thenReturn(false);

        boolean result = this.koiDictionaryService.isKoiDictionaryExistById(notExistId);

        assertEquals(false, result);

        verify(this.koiDictionaryRepository).existsById(notExistId);
    }
}
