package com.koibreeding.controller;

import com.koibreeding.dto.request.PaymentWebhookRequest;
import com.koibreeding.dto.response.ResCreatePaymentDto;
import com.koibreeding.dto.response.ResPaymentDto;
import com.koibreeding.service.PaymentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentControllerTest {

    @Mock
    private PaymentService paymentService;

    @InjectMocks
    private PaymentController paymentController;

    private ResCreatePaymentDto resCreatePaymentDto;
    private ResPaymentDto resPaymentDto;
    private PaymentWebhookRequest webhookRequest;

    @BeforeEach
    void initData() {
        resCreatePaymentDto = new ResCreatePaymentDto(
                1,
                1755000000000L,
                100000L,
                "https://img.vietqr.io/image/xxx",
                "PENDING"
        );

        resPaymentDto = new ResPaymentDto(
                1,
                1755000000000L,
                100000L,
                "PENDING"
        );

        webhookRequest = new PaymentWebhookRequest();
        webhookRequest.setId(123L);
        webhookRequest.setTransferType("in");
        webhookRequest.setTransferAmount(100000L);
        webhookRequest.setContent("PAY1755000000000");
    }

    @Test
    void createPayment_success() {
        // GIVEN
        when(paymentService.createPayment(1, 3)).thenReturn(resCreatePaymentDto);

        // WHEN
        ResponseEntity<ResCreatePaymentDto> result = paymentController.createPayment(3, 1);

        // THEN
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertEquals(resCreatePaymentDto, result.getBody());

        verify(paymentService).createPayment(1, 3);
    }

    @Test
    void createPayment_notCurrencyItem() {
        // GIVEN
        when(paymentService.createPayment(1, 5))
                .thenThrow(new RuntimeException("This item is not a currency package"));

        // WHEN + THEN
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> paymentController.createPayment(5, 1)
        );

        assertEquals("This item is not a currency package", exception.getMessage());
    }

    @Test
    void getPayment_success() {
        // GIVEN
        when(paymentService.getPayment(1755000000000L)).thenReturn(resPaymentDto);

        // WHEN
        ResponseEntity<ResPaymentDto> result = paymentController.getPayment(1755000000000L);

        // THEN
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertEquals(resPaymentDto, result.getBody());

        verify(paymentService).getPayment(1755000000000L);
    }

    @Test
    void getPayment_notFound() {
        // GIVEN
        when(paymentService.getPayment(999L))
                .thenThrow(new RuntimeException("Payment not found"));

        // WHEN + THEN
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> paymentController.getPayment(999L)
        );

        assertEquals("Payment not found", exception.getMessage());
    }

    @Test
    void handleWebhook_success() {
        // GIVEN
        doNothing().when(paymentService).handleWebhook(webhookRequest, "Apikey secret-key");

        // WHEN
        ResponseEntity<Map<String, Boolean>> result =
                paymentController.handleWebhook("Apikey secret-key", webhookRequest);

        // THEN
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertEquals(Map.of("success", true), result.getBody());

        verify(paymentService).handleWebhook(webhookRequest, "Apikey secret-key");
    }

    @Test
    void handleWebhook_invalidAuthorization() {
        // GIVEN
        doThrow(new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid SePay authorization"))
                .when(paymentService).handleWebhook(webhookRequest, "Apikey wrong-key");

        // WHEN + THEN
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> paymentController.handleWebhook("Apikey wrong-key", webhookRequest)
        );

        assertEquals(HttpStatus.UNAUTHORIZED, exception.getStatusCode());
    }

    @Test
    void handleWebhook_missingAuthorizationHeader() {
        // GIVEN
        doThrow(new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid SePay authorization"))
                .when(paymentService).handleWebhook(webhookRequest, null);

        // WHEN + THEN
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> paymentController.handleWebhook(null, webhookRequest)
        );

        assertEquals(HttpStatus.UNAUTHORIZED, exception.getStatusCode());
    }

    @Test
    void handleWebhook_amountMismatch() {
        // GIVEN
        doThrow(new IllegalArgumentException("Payment amount mismatch"))
                .when(paymentService).handleWebhook(webhookRequest, "Apikey secret-key");

        // WHEN + THEN
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> paymentController.handleWebhook("Apikey secret-key", webhookRequest)
        );

        assertEquals("Payment amount mismatch", exception.getMessage());
    }
}