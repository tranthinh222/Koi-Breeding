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
import com.fasterxml.jackson.datatype.jdk8.Jdk8Module;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.module.paramnames.ParameterNamesModule;
import com.koibreeding.IntergrationTest;
import com.koibreeding.domain.KoiDictionary;
import com.koibreeding.domain.Variety;
import com.koibreeding.enums.ScaleType;
import com.koibreeding.enums.Shape;
import com.koibreeding.repository.KoiDictionaryRepository;
import com.koibreeding.repository.VarietyRepository;

import jakarta.persistence.EntityManager;

@Transactional
@AutoConfigureMockMvc
@IntergrationTest
public class KoiDictionaryControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private KoiDictionaryRepository koiDictionaryRepository;

    @Autowired
    private VarietyRepository varietyRepository;

    @Autowired
    private EntityManager entityManager;

    public final ObjectMapper objectMapper = new ObjectMapper().registerModule(new ParameterNamesModule())
            .registerModule(new Jdk8Module())
            .registerModule(new JavaTimeModule());

    @BeforeEach
    public void init() {
        this.koiDictionaryRepository.deleteAll();
        this.varietyRepository.save(new Variety(null, "Kohaku", ""));
    }

    @Test
    public void createKoiDictionary_shouldReturnKoiDictionary_whenValid() throws Exception {
        KoiDictionary inputKoiDictionary = new KoiDictionary(null,
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
                BigDecimal.valueOf(1.68));

        String resultString = this.mockMvc
                .perform(post("/api/v1/dictionaries").contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsBytes(inputKoiDictionary)))
                .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();

        KoiDictionary response = objectMapper.readValue(resultString, new TypeReference<KoiDictionary>() {
        });

        assertNotNull(response, "Data cannot be null");
        assertTrue(response instanceof KoiDictionary, "Expected data must be 'KoiDictionary', but received '"
                + resultString.getClass().getSimpleName() + "'");
        assertThat(response).usingRecursiveComparison().ignoringFields("id", "variety").isEqualTo(inputKoiDictionary);
        assertEquals(inputKoiDictionary.getVariety().getId(), response.getVariety().getId(), "Variety is not matched");
    }
}
