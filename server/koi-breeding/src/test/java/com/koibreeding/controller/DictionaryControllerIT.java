package com.koibreeding.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.koibreeding.IntergrationTest;
import com.koibreeding.domain.Dictionary;
import com.koibreeding.domain.Variety;
import com.koibreeding.dto.RestResponse;
import com.koibreeding.enums.ScaleType;
import com.koibreeding.enums.Shape;

@Transactional
@AutoConfigureMockMvc
@IntergrationTest
public class DictionaryControllerIT {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private Variety variety;

    @BeforeEach
    void init() {
        variety = new Variety(1, "Kohaku", "");
    }

    @Test
    public void createDictionary_shouldReturnDictionary_whenValid() throws Exception {
        Dictionary inputDictionary = new Dictionary(null,
                "Kohaku",
                Shape.STANDARD,
                ScaleType.WAGOI,
                variety,
                "Japan",
                BigDecimal.valueOf(90.0),
                BigDecimal.valueOf(0.015),
                400,
                BigDecimal.valueOf(0.000015),
                100,
                BigDecimal.valueOf(1.68), null);

        String resultString = mockMvc
                .perform(
                        post("/api/v1/dictionaries")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        objectMapper.writeValueAsString(
                                                inputDictionary)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        RestResponse<Dictionary> response = objectMapper.readValue(resultString,
                new TypeReference<RestResponse<Dictionary>>() {
                });

        assertEquals(201, response.getStatusCode(), "Status code must be 201");
        assertNotNull(response.getMessage(), "Message cannot be null");
        assertNotNull(response.getData(), "Data cannot be null");
        assertTrue(response.getData() instanceof Dictionary, "Expected data must be 'Dictionary', but received '"
                + resultString.getClass().getSimpleName() + "'");
        assertThat(response.getData()).usingRecursiveComparison().ignoringFields("id", "variety")
                .isEqualTo(inputDictionary);
        assertEquals(inputDictionary.getVariety().getId(), response.getData().getVariety().getId(),
                "Variety is not matched");
    }
}
