package com.koibreeding.controller;

import com.koibreeding.dto.response.ResMarketDto;
import com.koibreeding.enums.Gender;
import com.koibreeding.service.MarketService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class MarketControllerTest {

    @Mock
    MarketService marketService;

    @InjectMocks
    MarketController marketController;

    ResMarketDto response;
    ResMarketDto response1;

    @BeforeEach
    void InitData(){
        response = new ResMarketDto();
        response.setKoiName("Kohaku");
        response.setKoiId(1);
        response.setPrice(Long.getLong("1000"));
        response.setSellerId(1);
        response.setSeller("user");
        response.setGender(Gender.MALE);
        response.setLength(BigDecimal.valueOf(100));
        response.setWeight(BigDecimal.valueOf(100));

        response1 = new ResMarketDto();
        response1.setKoiName("Shusui");
        response1.setKoiId(2);
        response1.setPrice(Long.getLong("1500"));
        response1.setSellerId(2);
        response1.setSeller("user1");
        response1.setGender(Gender.FEMALE);
        response1.setLength(BigDecimal.valueOf(100));
        response1.setWeight(BigDecimal.valueOf(100));
    }


    @Test
    void getMarket_success(){
        //Given
        when(marketService.filterMarketplace(
                "",
                "",
                null,
                null,
                null,
                null,
                null,
                null,
                null
        )).thenReturn(List.of(response, response1));

        //When
        ResponseEntity<List<ResMarketDto>> result =
                marketController.getMarketplace("",
                        "",
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null);

        //then
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertEquals(2, result.getBody().size());

        assertEquals("Kohaku", result.getBody().get(0).getKoiName());
        assertEquals(1, result.getBody().get(0).getKoiId());
        assertEquals(Long.getLong("1000"), result.getBody().get(0).getPrice());
        assertEquals(1, result.getBody().get(0).getSellerId());
        assertEquals("user", result.getBody().get(0).getSeller());
        assertEquals(Gender.MALE, result.getBody().get(0).getGender());
        assertEquals(BigDecimal.valueOf(100), result.getBody().get(0).getLength());
        assertEquals(BigDecimal.valueOf(100), result.getBody().get(0).getWeight());

        assertEquals("Shusui", result.getBody().get(1).getKoiName());
        assertEquals(2, result.getBody().get(1).getKoiId());
        assertEquals(Long.getLong("1500"), result.getBody().get(1).getPrice());
        assertEquals(2, result.getBody().get(1).getSellerId());
        assertEquals("user1", result.getBody().get(1).getSeller());
        assertEquals(Gender.FEMALE, result.getBody().get(1).getGender());
        assertEquals(BigDecimal.valueOf(100), result.getBody().get(1).getLength());
        assertEquals(BigDecimal.valueOf(100), result.getBody().get(1).getWeight());
    }

}
