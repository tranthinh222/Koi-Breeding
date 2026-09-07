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

import com.koibreeding.domain.Dictionary;
import com.koibreeding.domain.Variety;
import com.koibreeding.dto.response.ResultPaginationDTO;
import com.koibreeding.enums.ScaleType;
import com.koibreeding.enums.Shape;
import com.koibreeding.repository.DictionaryRepository;

@ExtendWith(MockitoExtension.class)
public class DictionaryServiceTest {

    @Mock
    private DictionaryRepository koiDictionaryRepository;

    @Mock
    private VarietyService varietyService;

    @InjectMocks
    private DictionaryService koiDictionaryService;

    @Test
    public void createDictionary_shouldReturnDictionary() {
        Dictionary inputDictionary = new Dictionary(
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

        Dictionary outputDictionary = new Dictionary(
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

        when(this.koiDictionaryRepository.save(inputDictionary)).thenReturn(outputDictionary);

        Dictionary result = this.koiDictionaryService.handleCreateDictionary(inputDictionary);

        assertEquals(outputDictionary.getId(), result.getId());

        verify(this.koiDictionaryRepository).save(inputDictionary);
    }

    @Test
    public void updateDictionary_shoudReturnUpdatedDictionary_whenCurrentDictionaryExist() {
        Variety mockVariety = new Variety(1, "Kohaku", "");
        Dictionary inputDictionary = new Dictionary(
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

        Dictionary oldDictionary = new Dictionary(
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

        when(this.koiDictionaryRepository.findById(1)).thenReturn(Optional.of(oldDictionary));
        when(this.varietyService.handleFetchVarietyById(1)).thenReturn(mockVariety);
        when(this.koiDictionaryRepository.save(oldDictionary)).thenReturn(oldDictionary);

        Dictionary result = this.koiDictionaryService.handleUpdateDictionary(inputDictionary);

        assertEquals(inputDictionary.getBaseMaxLength(), result.getBaseMaxLength());
        verify(this.koiDictionaryRepository).findById(1);
        verify(this.varietyService).handleFetchVarietyById(1);
        verify(this.koiDictionaryRepository).save(oldDictionary);
    }

    @Test
    public void updateDictionary_shoudReturnNull_whenCurrentDictionaryNotExist() {
        Variety mockVariety = new Variety(1, "Kohaku", "");
        Dictionary inputDictionary = new Dictionary(
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

        Dictionary result = this.koiDictionaryService.handleUpdateDictionary(inputDictionary);

        assertNull(result);
        verify(this.koiDictionaryRepository).findById(0);
    }

    @Test
    public void fetchDictionary_shouldReturnDictionary_whenIdValid() {
        Integer validId = 1;
        Variety mockVariety = new Variety(1, "Kohaku", "");
        Dictionary outputDictionary = new Dictionary(
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

        when(this.koiDictionaryRepository.findById(validId)).thenReturn(Optional.of(outputDictionary));

        Dictionary result = this.koiDictionaryService.handleFetchDictionaryById(validId);

        assertEquals(outputDictionary, result);

        verify(this.koiDictionaryRepository).findById(validId);
    }

    @Test
    public void fetchDictionary_shouldReturnNull_whenIdInvalid() {
        Integer invalidId = 0;

        when(this.koiDictionaryRepository.findById(invalidId)).thenReturn(Optional.empty());

        Dictionary result = this.koiDictionaryService.handleFetchDictionaryById(invalidId);

        assertNull(result);

        verify(this.koiDictionaryRepository).findById(invalidId);
    }

    @SuppressWarnings("unchecked")
    @Test
    public void fetchAllKoiDictionaries_shouldReturnResultPagination_whenHasData() {
        Variety mockVariety = new Variety(1, "Kohaku", "");
        List<Dictionary> mockDictionaryList = new ArrayList<>();
        for (int i = 0; i < 10; ++i) {
            mockDictionaryList.add(new Dictionary(
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
        Page<Dictionary> mockPageDictionary = new PageImpl<>(mockDictionaryList, inputPageable, totalElements);

        when(this.koiDictionaryRepository.findAll(inputPageable)).thenReturn(mockPageDictionary);

        ResultPaginationDTO result = this.koiDictionaryService.handleFetchAllKoiDictionaries(inputPageable);

        assertEquals(pageNumber + 1, result.getMeta().getPage());
        assertEquals(pageSize, result.getMeta().getPageSize());
        assertEquals((int) Math.ceil(totalElements / pageSize), result.getMeta().getTotalPages());
        assertEquals(totalElements, result.getMeta().getTotalElements());

        List<Dictionary> resultList = ((List<Dictionary>) result.getResult());
        assertEquals(mockDictionaryList.size(), resultList.size());
        assertEquals(mockDictionaryList.get(0).getName(), resultList.get(0).getName());
        assertEquals(mockDictionaryList.get(1).getName(), resultList.get(1).getName());

        verify(this.koiDictionaryRepository).findAll(inputPageable);
    }

    @Test
    public void deleteDictionary_shouldDeleteDictionary_whenIdValid() {
        Integer validId = 1;

        this.koiDictionaryService.handleDeleteDictionary(validId);

        verify(this.koiDictionaryRepository).deleteById(validId);
    }

    @Test
    public void checkExistById_shouldReturnTrue_whenDictionaryExist() {
        Integer existId = 1;

        when(this.koiDictionaryRepository.existsById(existId)).thenReturn(true);

        boolean result = this.koiDictionaryService.isDictionaryExistById(existId);

        assertEquals(true, result);

        verify(this.koiDictionaryRepository).existsById(existId);
    }

    @Test
    public void checkExistById_shouldReturnTrue_whenDictionaryNotExist() {
        Integer notExistId = 1000;

        when(this.koiDictionaryRepository.existsById(notExistId)).thenReturn(false);

        boolean result = this.koiDictionaryService.isDictionaryExistById(notExistId);

        assertEquals(false, result);

        verify(this.koiDictionaryRepository).existsById(notExistId);
    }
}
