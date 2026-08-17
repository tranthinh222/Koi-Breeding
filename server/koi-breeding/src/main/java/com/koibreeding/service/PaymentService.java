package com.koibreeding.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.koibreeding.domain.Item;
import com.koibreeding.domain.Payment;
import com.koibreeding.domain.Transaction;
import com.koibreeding.domain.User;
import com.koibreeding.domain.Wallet;
import com.koibreeding.dto.request.PaymentWebhookRequest;
import com.koibreeding.dto.response.ResCreatePaymentDto;
import com.koibreeding.dto.response.ResPaymentDto;
import com.koibreeding.enums.ItemType;
import com.koibreeding.enums.PaymentStatus;
import com.koibreeding.enums.NotificationType;
import com.koibreeding.enums.TransactionStatus;
import com.koibreeding.enums.TransactionType;
import com.koibreeding.repository.ItemRepository;
import com.koibreeding.repository.PaymentRepository;
import com.koibreeding.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService {

        private final PaymentRepository paymentRepository;
        private final UserRepository userRepository;
        private final ItemRepository itemRepository;
        private final WalletService walletService;
        private final VietQrService vietQrService;
        private final TransactionService transactionService;
        private final NotificationService notificationService;

        @Value("${sepay.api-key:}")
        private String sepayApiKey;

        /**
         * Tạo payment để user nạp tiền.
         */
        @Transactional
        public ResCreatePaymentDto createPayment(
                        Integer userId,
                        Integer itemId) {

                // 1. Tìm user
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                // 2. Tìm item
                Item item = itemRepository.findById(itemId)
                                .orElseThrow(() -> new RuntimeException("Item not found"));

                // 3. Chỉ cho phép thanh toán item loại CURRENCY
                if (item.getItemType() != ItemType.CURRENCY) {
                        throw new RuntimeException(
                                        "This item is not a currency package");
                }

                // 4. Lấy giá VNĐ từ Item
                Long amount;
                try {
                        amount = item.getPrice().longValueExact();
                } catch (ArithmeticException exception) {
                        throw new IllegalArgumentException("Payment amount must be a whole number of VND", exception);
                }

                if (amount == null || amount <= 0) {
                        throw new RuntimeException(
                                        "Invalid payment amount");
                }

                // 5. Tạo order code
                Long orderCode = generateOrderCode();

                // 6. Tạo Payment
                Payment payment = new Payment();

                payment.setUser(user);
                payment.setItem(item);
                payment.setOrderCode(orderCode);
                payment.setAmount(amount);
                payment.setStatus(PaymentStatus.PENDING);
                payment.setCreatedAt(LocalDateTime.now());

                // 7. Lưu payment
                payment = paymentRepository.save(payment);

                // 8. Nội dung chuyển khoản
                String paymentContent = "PAY" + payment.getOrderCode();

                // 9. Tạo VietQR
                String qrUrl = vietQrService.generateQrUrl(
                                payment.getAmount(),
                                paymentContent);

                // 10. Trả response cho frontend
                return new ResCreatePaymentDto(
                                payment.getId(),
                                payment.getOrderCode(),
                                payment.getAmount(),
                                qrUrl,
                                payment.getStatus().name());
        }

        /**
         * Lấy trạng thái payment.
         */
        @Transactional(readOnly = true)
        public ResPaymentDto getPayment(Long orderCode) {

                Payment payment = paymentRepository.findByOrderCode(orderCode)
                                .orElseThrow(() -> new RuntimeException(
                                                "Payment not found"));

                return new ResPaymentDto(
                                payment.getId(),
                                payment.getOrderCode(),
                                payment.getAmount(),
                                payment.getStatus().name());
        }

        /**
         * Xử lý webhook giao dịch từ SePay.
         *
         * SePay can retry/replay the same transaction, so the SePay transaction id
         * is stored on Payment and used as an idempotency key.
         */
        @Transactional
        public void handleWebhook(
                        PaymentWebhookRequest request,
                        String authorization) {

                verifySePayApiKey(authorization);

                if (request == null || request.getId() == null) {
                        throw new IllegalArgumentException("Invalid SePay webhook: missing id");
                }

                // Same SePay transaction may be delivered more than once.
                if (paymentRepository.findBySepayTransactionId(request.getId()).isPresent()) {
                        return;
                }

                if (!"in".equalsIgnoreCase(request.getTransferType())) {
                        return;
                }

                String paymentCode = extractPaymentCode(request);
                if (paymentCode == null) {
                        throw new IllegalArgumentException("Missing payment code");
                }

                Long orderCode = parseOrderCode(paymentCode);

                Payment payment = paymentRepository
                                .findByOrderCode(orderCode)
                                .orElseThrow(() -> new RuntimeException("Payment not found"));

                // Payment already completed by an earlier request.
                if (payment.getStatus() == PaymentStatus.PAID) {
                        return;
                }

                if (payment.getStatus() != PaymentStatus.PENDING) {
                        throw new IllegalStateException("Payment is no longer pending");
                }

                if (request.getTransferAmount() == null
                                || !request.getTransferAmount().equals(payment.getAmount())) {
                        throw new IllegalArgumentException("Payment amount mismatch");
                }

                // Only now mark the payment as paid and credit the wallet.
                payment.setStatus(PaymentStatus.PAID);
                payment.setPaidAt(LocalDateTime.now());
                payment.setSepayTransactionId(request.getId());
                paymentRepository.save(payment);

                // Credit Koins, NOT the VND transfer amount.
                Wallet wallet = walletService.credit(
                                payment.getUser().getId(),
                                payment.getItem().getEffectValue());

                Transaction transaction = new Transaction();
                transaction.setWallet(wallet);
                transaction.setItem(payment.getItem());
                transaction.setAmount(payment.getItem().getEffectValue());
                transaction.setTransactionType(TransactionType.DEPOSIT);
                transaction.setStatus(TransactionStatus.SUCCESSED);
                transaction.setDescription(
                                "Added "
                                                + payment.getItem().getEffectValue().stripTrailingZeros()
                                                                .toPlainString()
                                                + " Koins from payment "
                                                + payment.getOrderCode());
                transactionService.handleCreateTransaction(transaction);

                notificationService.createAndSend(
                                payment.getUser().getId(),
                                NotificationType.DEPOSIT_SUCCESS,
                                "Koins added",
                                "Your payment was confirmed and Koins were added to your wallet.");
        }

        private String extractPaymentCode(PaymentWebhookRequest request) {
                if (request.getCode() != null && request.getCode().matches("(?i)PAY\\d+")) {
                        return request.getCode().toUpperCase();
                }

                String content = request.getContent();
                if (content == null) {
                        return null;
                }

                java.util.regex.Matcher matcher = java.util.regex.Pattern
                                .compile("(?i)\\b(PAY\\d+)\\b")
                                .matcher(content);

                return matcher.find() ? matcher.group(1).toUpperCase() : null;
        }

        private Long parseOrderCode(String paymentCode) {
                try {
                        return Long.parseLong(paymentCode.substring(3));
                } catch (RuntimeException exception) {
                        throw new IllegalArgumentException("Invalid payment code: " + paymentCode, exception);
                }
        }

        private void verifySePayApiKey(String authorization) {
                if (sepayApiKey == null || sepayApiKey.isBlank()) {
                        throw new IllegalStateException("SePay API key is not configured");
                }

                String prefix = "Apikey ";
                if (authorization == null || !authorization.startsWith(prefix)) {
                        throw new org.springframework.web.server.ResponseStatusException(
                                        org.springframework.http.HttpStatus.UNAUTHORIZED,
                                        "Invalid SePay authorization");
                }

                byte[] expected = sepayApiKey.getBytes(StandardCharsets.UTF_8);
                byte[] actual = authorization.substring(prefix.length()).getBytes(StandardCharsets.UTF_8);

                if (!MessageDigest.isEqual(expected, actual)) {
                        throw new org.springframework.web.server.ResponseStatusException(
                                        org.springframework.http.HttpStatus.UNAUTHORIZED,
                                        "Invalid SePay authorization");
                }
        }

        /**
         * Sinh order code.
         */
        private Long generateOrderCode() {
                Long orderCode;

                do {
                        orderCode = System.currentTimeMillis() * 1000L
                                        + ThreadLocalRandom.current().nextLong(1000);
                } while (paymentRepository.findByOrderCode(orderCode).isPresent());

                return orderCode;
        }
}
