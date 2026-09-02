//package com.koibreeding.controller;
//
//import com.koibreeding.dto.request.*;
//import com.koibreeding.dto.response.ResMarketDto;
//import com.koibreeding.dto.response.ResTradeDto;
//import com.koibreeding.enums.Gender;
//import com.koibreeding.service.MarketService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//
//import java.math.BigDecimal;
//import java.time.OffsetDateTime;
//import java.util.List;
//
//import static org.junit.jupiter.api.Assertions.assertEquals;
//import static org.junit.jupiter.api.Assertions.assertNotNull;
//import static org.mockito.Mockito.*;
//
//@ExtendWith(MockitoExtension.class)
//public class MarketControllerTest {
//
//    @Mock
//    private MarketService marketService;
//
//    @InjectMocks
//    private MarketController marketController;
//
//    private ResMarketDto response;
//    private ResMarketDto response1;
//    private ResMarketListKoi resMarketListKoi;
//    private ResMarketListKoi resMarketListKoi1;
//    private ResMarketKois resMarketKois;
//    private ResMarketKois resMarketKois1;
//    private ResTradeDto resTradeDto;
//
//    @BeforeEach
//    void initData() {
//        // Initialize ResMarketDto
//        response = new ResMarketDto();
//        response.setKoiName("Kohaku");
//        response.setKoiId(1);
//        response.setPrice(1000L);
//        response.setSellerId(1);
//        response.setSeller("user");
//        response.setGender(Gender.MALE);
//        response.setLength(BigDecimal.valueOf(100));
//        response.setWeight(BigDecimal.valueOf(100));
//
//        response1 = new ResMarketDto();
//        response1.setKoiName("Shusui");
//        response1.setKoiId(2);
//        response1.setPrice(1500L);
//        response1.setSellerId(2);
//        response1.setSeller("user1");
//        response1.setGender(Gender.FEMALE);
//        response1.setLength(BigDecimal.valueOf(100));
//        response1.setWeight(BigDecimal.valueOf(100));
//
//        // Initialize ResMarketListKoi
//        resMarketListKoi = new ResMarketListKoi();
//        resMarketListKoi.setKoiId(1);
//        resMarketListKoi.setKoiName("Kohaku");
//        resMarketListKoi.setGender(Gender.MALE);
//
//        resMarketListKoi1 = new ResMarketListKoi();
//        resMarketListKoi1.setKoiId(3);
//        resMarketListKoi1.setKoiName("Sanke");
//        resMarketListKoi1.setGender(Gender.FEMALE);
//
//        // Initialize ResMarketKois
//        resMarketKois = new ResMarketKois();
//        resMarketKois.setKoiId(1);
//        resMarketKois.setKoiName("Kohaku");
//        resMarketKois.setPrice(1000L);
//        resMarketKois.setGender(Gender.MALE);
//
//        resMarketKois1 = new ResMarketKois();
//        resMarketKois1.setKoiId(2);
//        resMarketKois1.setKoiName("Shusui");
//        resMarketKois1.setPrice(1500L);
//        resMarketKois1.setGender(Gender.FEMALE);
//
//        // Initialize ResTradeDto
//        resTradeDto = new ResTradeDto();
//        resTradeDto.setListing(1);
//        resTradeDto.setBuyer(1);
//        resTradeDto.setSeller(2);
//        resTradeDto.setPrice(1000L);
//        resTradeDto.setTradeAt(OffsetDateTime.now());
//    }
//
//    @Test
//    void getMarketplace_success() {
//        // Given
//        when(marketService.filterMarketplace(
//                "",
//                "",
//                null,
//                null,
//                null,
//                null,
//                null,
//                null,
//                null
//        )).thenReturn(List.of(response, response1));
//
//        // When
//        ResponseEntity<List<ResMarketDto>> result =
//                marketController.getMarketplace("",
//                        "",
//                        null,
//                        null,
//                        null,
//                        null,
//                        null,
//                        null,
//                        null);
//
//        // Then
//        assertEquals(HttpStatus.OK, result.getStatusCode());
//        assertNotNull(result.getBody());
//        assertEquals(2, result.getBody().size());
//
//        assertEquals("Kohaku", result.getBody().get(0).getKoiName());
//        assertEquals(1, result.getBody().get(0).getKoiId());
//        assertEquals(1000L, result.getBody().get(0).getPrice());
//        assertEquals(1, result.getBody().get(0).getSellerId());
//        assertEquals("user", result.getBody().get(0).getSeller());
//        assertEquals(Gender.MALE, result.getBody().get(0).getGender());
//
//        assertEquals("Shusui", result.getBody().get(1).getKoiName());
//        assertEquals(2, result.getBody().get(1).getKoiId());
//        assertEquals(1500L, result.getBody().get(1).getPrice());
//        assertEquals(2, result.getBody().get(1).getSellerId());
//        assertEquals("user1", result.getBody().get(1).getSeller());
//        assertEquals(Gender.FEMALE, result.getBody().get(1).getGender());
//
//        verify(marketService, times(1)).filterMarketplace(
//                "",
//                "",
//                null,
//                null,
//                null,
//                null,
//                null,
//                null,
//                null
//        );
//    }
//
//
//    @Test
//    void getMarketListKois_success() {
//        // Given
//        Integer userId = 1;
//        when(marketService.getMarketListKois(userId))
//                .thenReturn(List.of(resMarketListKoi, resMarketListKoi1));
//
//        // When
//        ResponseEntity<List<ResMarketListKoi>> result =
//                marketController.getMarketListKois(userId);
//
//        // Then
//        assertEquals(HttpStatus.OK, result.getStatusCode());
//        assertNotNull(result.getBody());
//        assertEquals(2, result.getBody().size());
//
//        assertEquals(1, result.getBody().get(0).getKoiId());
//        assertEquals("Kohaku", result.getBody().get(0).getKoiName());
//        assertEquals(Gender.MALE, result.getBody().get(0).getGender());
//
//        assertEquals(3, result.getBody().get(1).getKoiId());
//        assertEquals("Sanke", result.getBody().get(1).getKoiName());
//        assertEquals(Gender.FEMALE, result.getBody().get(1).getGender());
//
//        verify(marketService, times(1)).getMarketListKois(userId);
//    }
//
//    @Test
//    void getMarketListKois_empty() {
//        // Given
//        Integer userId = 99;
//        when(marketService.getMarketListKois(userId))
//                .thenReturn(List.of());
//
//        // When
//        ResponseEntity<List<ResMarketListKoi>> result =
//                marketController.getMarketListKois(userId);
//
//        // Then
//        assertEquals(HttpStatus.OK, result.getStatusCode());
//        assertNotNull(result.getBody());
//        assertEquals(0, result.getBody().size());
//
//        verify(marketService, times(1)).getMarketListKois(userId);
//    }
//
//    @Test
//    void getMarketBuyKois_success() {
//        // Given
//        Integer userId = 1;
//        when(marketService.getMarketListBuyKois(userId))
//                .thenReturn(List.of(resMarketKois, resMarketKois1));
//
//        // When
//        ResponseEntity<List<ResMarketKois>> result =
//                marketController.getMarketBuyKois(userId);
//
//        // Then
//        assertEquals(HttpStatus.OK, result.getStatusCode());
//        assertNotNull(result.getBody());
//        assertEquals(2, result.getBody().size());
//
//        assertEquals(1, result.getBody().get(0).getKoiId());
//        assertEquals("Kohaku", result.getBody().get(0).getKoiName());
//        assertEquals(1000L, result.getBody().get(0).getPrice());
//
//        assertEquals(2, result.getBody().get(1).getKoiId());
//        assertEquals("Shusui", result.getBody().get(1).getKoiName());
//        assertEquals(1500L, result.getBody().get(1).getPrice());
//
//        verify(marketService, times(1)).getMarketListBuyKois(userId);
//    }
//
//    @Test
//    void getMarketBuyKois_empty() {
//        // Given
//        Integer userId = 99;
//        when(marketService.getMarketListBuyKois(userId))
//                .thenReturn(List.of());
//
//        // When
//        ResponseEntity<List<ResMarketKois>> result =
//                marketController.getMarketBuyKois(userId);
//
//        // Then
//        assertEquals(HttpStatus.OK, result.getStatusCode());
//        assertNotNull(result.getBody());
//        assertEquals(0, result.getBody().size());
//
//        verify(marketService, times(1)).getMarketListBuyKois(userId);
//    }
//
//    @Test
//    void sellKoi_success() {
//        // Given
//        Integer userId = 1;
//        ResMarketSellKoi request = new ResMarketSellKoi();
//        request.setKoiId(1);
//        request.setPrice(1000L);
//
//        when(marketService.sellKoi(userId, request))
//                .thenReturn(response);
//
//        // When
//        ResponseEntity<ResMarketDto> result =
//                marketController.sellKoi(userId, request);
//
//        // Then
//        assertEquals(HttpStatus.OK, result.getStatusCode());
//        assertNotNull(result.getBody());
//        assertEquals("Kohaku", result.getBody().getKoiName());
//        assertEquals(1, result.getBody().getKoiId());
//        assertEquals(1000L, result.getBody().getPrice());
//        assertEquals(1, result.getBody().getSellerId());
//
//        verify(marketService, times(1)).sellKoi(userId, request);
//    }
//
//    @Test
//    void sellKoi_differentUser_success() {
//        // Given
//        Integer userId = 2;
//        ResMarketSellKoi request = new ResMarketSellKoi();
//        request.setKoiId(2);
//        request.setPrice(1500L);
//
//        when(marketService.sellKoi(userId, request))
//                .thenReturn(response1);
//
//        // When
//        ResponseEntity<ResMarketDto> result =
//                marketController.sellKoi(userId, request);
//
//        // Then
//        assertEquals(HttpStatus.OK, result.getStatusCode());
//        assertNotNull(result.getBody());
//        assertEquals("Shusui", result.getBody().getKoiName());
//        assertEquals(2, result.getBody().getKoiId());
//        assertEquals(1500L, result.getBody().getPrice());
//        assertEquals(2, result.getBody().getSellerId());
//
//        verify(marketService, times(1)).sellKoi(userId, request);
//    }
//
//    @Test
//    void buyKoiInMarket_success() {
//        // Given
//        Integer userId = 1;
//        ReqBuyKoi request = new ReqBuyKoi();
//        request.setPrice(1000L);
//        request.setKoiId(1);
//
//        when(marketService.buyKoi(userId, request))
//                .thenReturn(resTradeDto);
//
//        // When
//        ResponseEntity<ResTradeDto> result =
//                marketController.buyKoiInMarket(userId, request);
//
//        // Then
//        assertEquals(HttpStatus.OK, result.getStatusCode());
//        assertNotNull(result.getBody());
//        assertEquals(1, result.getBody().getListing());;
//        assertEquals(1, result.getBody().getBuyer());
//        assertEquals(2, result.getBody().getSeller());
//        assertEquals(1000L, result.getBody().getPrice());
//
//        verify(marketService, times(1)).buyKoi(userId, request);
//    }
//
//    @Test
//    void getMarketplace_priceFilter_success() {
//        // Given
//        BigDecimal minPrice = BigDecimal.valueOf(900);
//        BigDecimal maxPrice = BigDecimal.valueOf(1100);
//
//        when(marketService.filterMarketplace(
//                null,
//                null,
//                minPrice,
//                maxPrice,
//                null,
//                null,
//                null,
//                null,
//                null
//        )).thenReturn(List.of(response));
//
//        // When
//        ResponseEntity<List<ResMarketDto>> result =
//                marketController.getMarketplace(
//                        null,
//                        null,
//                        minPrice,
//                        maxPrice,
//                        null,
//                        null,
//                        null,
//                        null,
//                        null
//                );
//
//        // Then
//        assertEquals(HttpStatus.OK, result.getStatusCode());
//        assertEquals(1, result.getBody().size());
//        assertEquals("Kohaku", result.getBody().get(0).getKoiName());
//    }
//}