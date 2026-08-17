package com.koibreeding.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
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

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.koibreeding.IntergrationTest;
import com.koibreeding.domain.Dictionary;
import com.koibreeding.domain.Variety;
import com.koibreeding.enums.ScaleType;
import com.koibreeding.enums.Shape;
import com.koibreeding.repository.KoiDictionaryRepository;
import com.koibreeding.repository.VarietyRepository;

@Transactional
@AutoConfigureMockMvc
@IntergrationTest
class KoiDictionaryControllerIT {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private KoiDictionaryRepository koiDictionaryRepository;

        @Autowired
        private VarietyRepository varietyRepository;

        private final ObjectMapper objectMapper = new ObjectMapper();

        private Variety variety;

        @BeforeEach
        void init() {
                koiDictionaryRepository.deleteAll();
                varietyRepository.deleteAll();

                variety = varietyRepository.save(
                                new Variety(null, "Kohaku", ""));
        }

        @Test
        void createKoiDictionary_shouldReturnKoiDictionary_whenValid() throws Exception {

                Dictionary inputKoiDictionary = new Dictionary(
                                null,
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
                                BigDecimal.valueOf(1.68));

                String resultString = mockMvc
                                .perform(
                                                post("/api/v1/dictionaries")
                                                                .contentType(MediaType.APPLICATION_JSON)
                                                                .content(
                                                                                objectMapper.writeValueAsString(
                                                                                                inputKoiDictionary)))
                                .andExpect(status().isCreated())
                                .andReturn()
                                .getResponse()
                                .getContentAsString();

                JsonNode root = objectMapper.readTree(resultString);

                Dictionary response = objectMapper.treeToValue(
                                root.get("data"),
                                Dictionary.class);

                assertNotNull(response);

                assertThat(response)
                                .usingRecursiveComparison()
                                .ignoringFields("id", "variety")
                                .isEqualTo(inputKoiDictionary);

                assertEquals(
                                variety.getId(),
                                response.getVariety().getId(),
                                "Variety is not matched");
        }
}
