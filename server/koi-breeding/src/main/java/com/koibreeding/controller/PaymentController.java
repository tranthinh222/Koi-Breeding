package com.koibreeding.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.koibreeding.dto.request.PaymentWebhookRequest;
import com.koibreeding.dto.response.ResCreatePaymentDto;
import com.koibreeding.dto.response.ResPaymentDto;
import com.koibreeding.service.PaymentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@CrossOrigin(originPatterns = { "http://localhost:*", "http://127.0.0.1:*", "http://127.0.0.2:*" })
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/payments/items/{itemId}")
    public ResponseEntity<ResCreatePaymentDto> createPayment(
            @PathVariable Integer itemId,
            @RequestParam Integer userId) {
        return ResponseEntity.ok(paymentService.createPayment(userId, itemId));
    }

    @GetMapping("/payments/{orderCode}")
    public ResponseEntity<ResPaymentDto> getPayment(@PathVariable Long orderCode) {
        return ResponseEntity.ok(paymentService.getPayment(orderCode));
    }

    @PostMapping("/payments/webhook")
    public ResponseEntity<Map<String, Boolean>> handleWebhook(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @RequestBody PaymentWebhookRequest request) {
        paymentService.handleWebhook(request, authorization);
        // SePay requires HTTP 200/201 and exactly {"success": true}.
        return ResponseEntity.ok(Map.of("success", true));
    }
}
