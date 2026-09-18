package com.koibreeding.controller;

import com.koibreeding.dto.request.RequestHealKoiDTO;
import com.koibreeding.dto.response.ResHealKoiDTO;
import com.koibreeding.dto.response.ResKoiDTO;
import com.koibreeding.exception.GlobalExceptionHandler;
import com.koibreeding.service.KoiService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class KoiHealingControllerTest {
    private KoiService service;
    private com.koibreeding.repository.UserRepository users;
    private MockMvc mvc;

    @BeforeEach
    void setUp() {
        service = mock(KoiService.class);
        users = mock(com.koibreeding.repository.UserRepository.class);
        mvc = MockMvcBuilders.standaloneSetup(new KoiController(service, users))
                .setControllerAdvice(new GlobalExceptionHandler()).build();
    }

    @Test
    void healingUsesVerifiedUserId() throws Exception {
        var owner = new com.koibreeding.domain.User();
        owner.setId(1);
        when(users.findByUsername("owner")).thenReturn(java.util.Optional.of(owner));
        ResKoiDTO koi = new ResKoiDTO();
        koi.setHealth(90);
        when(service.handleHealKoi(20, new RequestHealKoiDTO(1, 30, 1)))
                .thenReturn(new ResHealKoiDTO(koi, 20, 1, 4));
        mvc.perform(post("/api/v1/kois/20/heal").principal(() -> "owner")
                .contentType(MediaType.APPLICATION_JSON).content("{\"userId\":1,\"itemId\":30,\"quantity\":1}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.healthRestored").value(20))
                .andExpect(jsonPath("$.koi.health").value(90));
        verify(service).handleHealKoi(20, new RequestHealKoiDTO(1, 30, 1));
    }

    @Test
    void zeroQuantityIsRejectedBeforeUsingMedicine() throws Exception {
        mvc.perform(post("/api/v1/kois/20/heal").principal(() -> "owner")
                .contentType(MediaType.APPLICATION_JSON).content("{\"userId\":1,\"itemId\":30,\"quantity\":0}"))
                .andExpect(status().isBadRequest());
        verifyNoInteractions(service);
    }

    @Test
    void forgedUserIdIsRejected() throws Exception {
        var owner = new com.koibreeding.domain.User();
        owner.setId(2);
        when(users.findByUsername("owner")).thenReturn(java.util.Optional.of(owner));
        mvc.perform(post("/api/v1/kois/20/heal").principal(() -> "owner")
                .contentType(MediaType.APPLICATION_JSON).content("{\"userId\":1,\"itemId\":30,\"quantity\":1}"))
                .andExpect(status().isForbidden());
        verifyNoInteractions(service);
    }

    @Test
    void missingUserIdIsRejected() throws Exception {
        mvc.perform(post("/api/v1/kois/20/heal").principal(() -> "owner")
                .contentType(MediaType.APPLICATION_JSON).content("{\"itemId\":30,\"quantity\":1}"))
                .andExpect(status().isBadRequest());
        verifyNoInteractions(service, users);
    }

    @Test
    void missingItemIsRejectedBeforeUsingMedicine() throws Exception {
        mvc.perform(post("/api/v1/kois/20/heal").principal(() -> "owner")
                .contentType(MediaType.APPLICATION_JSON).content("{\"userId\":1,\"quantity\":1}"))
                .andExpect(status().isBadRequest());
        verifyNoInteractions(service);
    }
}
