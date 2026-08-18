package com.koibreeding.service;

import com.koibreeding.domain.Item;
import com.koibreeding.domain.Payment;
import com.koibreeding.domain.Transaction;
import com.koibreeding.domain.User;
import com.koibreeding.domain.Wallet;
import com.koibreeding.dto.request.PaymentWebhookRequest;
import com.koibreeding.dto.response.ResCreatePaymentDto;
import com.koibreeding.dto.response.ResPaymentDto;
import com.koibreeding.enums.ItemType;
import com.koibreeding.enums.NotificationType;
import com.koibreeding.enums.PaymentStatus;
import com.koibreeding.repository.ItemRepository;
import com.koibreeding.repository.PaymentRepository;
import com.koibreeding.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ItemRepository itemRepository;

    @Mock
    private WalletService walletService;

    @Mock
    private VietQrService vietQrService;

    @Mock
    private TransactionService transactionService;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private PaymentService paymentService;

    private User user;
    private Item currencyItem;
    private Item foodItem;
    private Wallet wallet;

    @BeforeEach
    void initData() {
        user = new User();
        user.setId(1);

        currencyItem = new Item();
        currencyItem.setId(3);
        currencyItem.setName("100 Coins Package");
        currencyItem.setPrice(new BigDecimal("100000"));
        currencyItem.setItemType(ItemType.CURRENCY);
        currencyItem.setEffectValue(new BigDecimal("100"));

        foodItem = new Item();
        foodItem.setId(1);
        foodItem.setName("Koi Food");
        foodItem.setPrice(new BigDecimal("25"));
        foodItem.setItemType(ItemType.FOOD);

        wallet = new Wallet();
        wallet.setId(1);
        wallet.setUser(user);
        wallet.setBalance(new BigDecimal("100"));

        ReflectionTestUtils.setField(paymentService, "sepayApiKey", "secret-key");
    }

    // ---------- createPayment ----------

    @Test
    void createPayment_success() {
        // GIVEN
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(itemRepository.findById(3)).thenReturn(Optional.of(currencyItem));
        when(paymentRepository.findByOrderCode(any())).thenReturn(Optional.empty());
        when(paymentRepository.save(any(Payment.class))).thenAnswer(invocation -> {
            Payment p = invocation.getArgument(0);
            p.setId(1);
            return p;
        });
        when(vietQrService.generateQrUrl(anyLong(), any())).thenReturn("https://img.vietqr.io/image/xxx");

        // WHEN
        ResCreatePaymentDto result = paymentService.createPayment(1, 3);

        // THEN
        assertNotNull(result);
        assertEquals(100000L, result.getAmount());
        assertEquals("https://img.vietqr.io/image/xxx", result.getQrUrl());
        assertEquals("PENDING", result.getStatus());

        verify(paymentRepository).save(any(Payment.class));
        verify(vietQrService).generateQrUrl(eq(100000L), any());
    }

    @Test
    void createPayment_userNotFound() {
        // GIVEN
        when(userRepository.findById(1)).thenReturn(Optional.empty());

        // WHEN + THEN
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> paymentService.createPayment(1, 3)
        );

        assertEquals("User not found", exception.getMessage());
        verifyNoInteractions(itemRepository, vietQrService);
    }

    @Test
    void createPayment_itemNotFound() {
        // GIVEN
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(itemRepository.findById(3)).thenReturn(Optional.empty());

        // WHEN + THEN
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> paymentService.createPayment(1, 3)
        );

        assertEquals("Item not found", exception.getMessage());
        verifyNoInteractions(vietQrService);
    }

    @Test
    void createPayment_itemNotCurrencyType() {
        // GIVEN
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(itemRepository.findById(1)).thenReturn(Optional.of(foodItem));

        // WHEN + THEN
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> paymentService.createPayment(1, 1)
        );

        assertEquals("This item is not a currency package", exception.getMessage());
        verifyNoInteractions(paymentRepository, vietQrService);
    }

    @Test
    void createPayment_nonIntegerPrice() {
        // GIVEN
        currencyItem.setPrice(new BigDecimal("100000.5"));
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(itemRepository.findById(3)).thenReturn(Optional.of(currencyItem));

        // WHEN + THEN
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> paymentService.createPayment(1, 3)
        );

        assertEquals("Payment amount must be a whole number of VND", exception.getMessage());
        verifyNoInteractions(paymentRepository, vietQrService);
    }

    @Test
    void createPayment_negativeAmount() {
        // GIVEN
        currencyItem.setPrice(new BigDecimal("-100"));
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(itemRepository.findById(3)).thenReturn(Optional.of(currencyItem));

        // WHEN + THEN
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> paymentService.createPayment(1, 3)
        );

        assertEquals("Invalid payment amount", exception.getMessage());
        verifyNoInteractions(paymentRepository, vietQrService);
    }

    // ---------- getPayment ----------

    @Test
    void getPayment_success() {
        // GIVEN
        Payment payment = new Payment();
        payment.setId(1);
        payment.setOrderCode(1755000000000L);
        payment.setAmount(100000L);
        payment.setStatus(PaymentStatus.PENDING);

        when(paymentRepository.findByOrderCode(1755000000000L)).thenReturn(Optional.of(payment));

        // WHEN
        ResPaymentDto result = paymentService.getPayment(1755000000000L);

        // THEN
        assertNotNull(result);
        assertEquals(1755000000000L, result.getOrderCode());
        assertEquals(100000L, result.getAmount());
        assertEquals("PENDING", result.getStatus());
    }

    @Test
    void getPayment_notFound() {
        // GIVEN
        when(paymentRepository.findByOrderCode(999L)).thenReturn(Optional.empty());

        // WHEN + THEN
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> paymentService.getPayment(999L)
        );

        assertEquals("Payment not found", exception.getMessage());
    }


    private PaymentWebhookRequest buildWebhookRequest() {
        PaymentWebhookRequest request = new PaymentWebhookRequest();
        request.setId(123L);
        request.setTransferType("in");
        request.setTransferAmount(100000L);
        request.setContent("PAY1755000000000");
        return request;
    }

    private Payment buildPendingPayment() {
        Payment payment = new Payment();
        payment.setId(1);
        payment.setUser(user);
        payment.setItem(currencyItem);
        payment.setOrderCode(1755000000000L);
        payment.setAmount(100000L);
        payment.setStatus(PaymentStatus.PENDING);
        return payment;
    }

    @Test
    void handleWebhook_apiKeyNotConfigured_shouldThrowIllegalStateException() {
        // GIVEN
        ReflectionTestUtils.setField(paymentService, "sepayApiKey", "");
        PaymentWebhookRequest request = buildWebhookRequest();

        // WHEN + THEN
        IllegalStateException exception = assertThrows(
                IllegalStateException.class,
                () -> paymentService.handleWebhook(request, "Apikey secret-key")
        );

        assertEquals("SePay API key is not configured", exception.getMessage());
        verifyNoInteractions(paymentRepository);
    }

    @Test
    void handleWebhook_missingAuthorizationHeader_shouldThrowUnauthorized() {
        // GIVEN
        PaymentWebhookRequest request = buildWebhookRequest();

        // WHEN + THEN
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> paymentService.handleWebhook(request, null)
        );

        assertEquals(401, exception.getStatusCode().value());
        verifyNoInteractions(paymentRepository);
    }

    @Test
    void handleWebhook_wrongAuthorizationKey_shouldThrowUnauthorized() {
        // GIVEN
        PaymentWebhookRequest request = buildWebhookRequest();

        // WHEN + THEN
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> paymentService.handleWebhook(request, "Apikey wrong-key")
        );

        assertEquals(401, exception.getStatusCode().value());
        verifyNoInteractions(paymentRepository);
    }

    @Test
    void handleWebhook_missingRequestId_shouldThrowIllegalArgumentException() {
        // GIVEN
        PaymentWebhookRequest request = buildWebhookRequest();
        request.setId(null);

        // WHEN + THEN
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> paymentService.handleWebhook(request, "Apikey secret-key")
        );

        assertEquals("Invalid SePay webhook: missing id", exception.getMessage());
    }

    @Test
    void handleWebhook_duplicateTransaction_shouldReturnEarly() {
        // GIVEN
        PaymentWebhookRequest request = buildWebhookRequest();
        when(paymentRepository.findBySepayTransactionId(123L))
                .thenReturn(Optional.of(buildPendingPayment()));

        // WHEN
        paymentService.handleWebhook(request, "Apikey secret-key");

        // THEN
        verify(paymentRepository, never()).findByOrderCode(any());
        verifyNoInteractions(walletService, transactionService, notificationService);
    }

    @Test
    void handleWebhook_transferTypeNotIn_shouldReturnEarly() {
        // GIVEN
        PaymentWebhookRequest request = buildWebhookRequest();
        request.setTransferType("out");
        when(paymentRepository.findBySepayTransactionId(123L)).thenReturn(Optional.empty());

        // WHEN
        paymentService.handleWebhook(request, "Apikey secret-key");

        // THEN
        verify(paymentRepository, never()).findByOrderCode(any());
        verifyNoInteractions(walletService, transactionService, notificationService);
    }

    @Test
    void handleWebhook_missingPaymentCode_shouldThrowIllegalArgumentException() {
        // GIVEN
        PaymentWebhookRequest request = buildWebhookRequest();
        request.setContent("no code here");
        when(paymentRepository.findBySepayTransactionId(123L)).thenReturn(Optional.empty());

        // WHEN + THEN
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> paymentService.handleWebhook(request, "Apikey secret-key")
        );

        assertEquals("Missing payment code", exception.getMessage());
    }

    @Test
    void handleWebhook_paymentNotFound_shouldThrowException() {
        // GIVEN
        PaymentWebhookRequest request = buildWebhookRequest();
        when(paymentRepository.findBySepayTransactionId(123L)).thenReturn(Optional.empty());
        when(paymentRepository.findByOrderCode(1755000000000L)).thenReturn(Optional.empty());

        // WHEN + THEN
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> paymentService.handleWebhook(request, "Apikey secret-key")
        );

        assertEquals("Payment not found", exception.getMessage());
    }

    @Test
    void handleWebhook_paymentAlreadyPaid_shouldReturnEarly() {
        // GIVEN
        PaymentWebhookRequest request = buildWebhookRequest();
        Payment paidPayment = buildPendingPayment();
        paidPayment.setStatus(PaymentStatus.PAID);

        when(paymentRepository.findBySepayTransactionId(123L)).thenReturn(Optional.empty());
        when(paymentRepository.findByOrderCode(1755000000000L)).thenReturn(Optional.of(paidPayment));

        // WHEN
        paymentService.handleWebhook(request, "Apikey secret-key");

        // THEN
        verify(paymentRepository, never()).save(any(Payment.class));
        verifyNoInteractions(walletService, transactionService, notificationService);
    }

    @Test
    void handleWebhook_amountMismatch_shouldThrowIllegalArgumentException() {
        // GIVEN
        PaymentWebhookRequest request = buildWebhookRequest();
        request.setTransferAmount(50000L);
        Payment pendingPayment = buildPendingPayment();

        when(paymentRepository.findBySepayTransactionId(123L)).thenReturn(Optional.empty());
        when(paymentRepository.findByOrderCode(1755000000000L)).thenReturn(Optional.of(pendingPayment));

        // WHEN + THEN
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> paymentService.handleWebhook(request, "Apikey secret-key")
        );

        assertEquals("Payment amount mismatch", exception.getMessage());
        verify(paymentRepository, never()).save(any(Payment.class));
        verifyNoInteractions(walletService, transactionService, notificationService);
    }

    @Test
    void handleWebhook_missingTransferAmount_shouldThrowIllegalArgumentException() {
        // GIVEN
        PaymentWebhookRequest request = buildWebhookRequest();
        request.setTransferAmount(null);
        Payment pendingPayment = buildPendingPayment();

        when(paymentRepository.findBySepayTransactionId(123L)).thenReturn(Optional.empty());
        when(paymentRepository.findByOrderCode(1755000000000L)).thenReturn(Optional.of(pendingPayment));

        // WHEN + THEN
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> paymentService.handleWebhook(request, "Apikey secret-key")
        );

        assertEquals("Payment amount mismatch", exception.getMessage());
    }

    @Test
    void handleWebhook_success_shouldCreditWalletAndNotify() {
        // GIVEN
        PaymentWebhookRequest request = buildWebhookRequest();
        Payment pendingPayment = buildPendingPayment();

        when(paymentRepository.findBySepayTransactionId(123L)).thenReturn(Optional.empty());
        when(paymentRepository.findByOrderCode(1755000000000L)).thenReturn(Optional.of(pendingPayment));
        when(paymentRepository.save(any(Payment.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(walletService.credit(1, currencyItem.getEffectValue())).thenReturn(wallet);
        when(transactionService.handleCreateTransaction(any(Transaction.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // WHEN
        paymentService.handleWebhook(request, "Apikey secret-key");

        // THEN
        ArgumentCaptor<Payment> paymentCaptor = ArgumentCaptor.forClass(Payment.class);
        verify(paymentRepository).save(paymentCaptor.capture());
        assertEquals(PaymentStatus.PAID, paymentCaptor.getValue().getStatus());
        assertEquals(123L, paymentCaptor.getValue().getSepayTransactionId());
        assertNotNull(paymentCaptor.getValue().getPaidAt());

        verify(walletService).credit(1, currencyItem.getEffectValue());

        ArgumentCaptor<Transaction> transactionCaptor = ArgumentCaptor.forClass(Transaction.class);
        verify(transactionService).handleCreateTransaction(transactionCaptor.capture());
        assertEquals(currencyItem.getEffectValue(), transactionCaptor.getValue().getAmount());

        verify(notificationService).createAndSend(
                eq(1), eq(NotificationType.DEPOSIT_SUCCESS), eq("Koins added"), anyString());
    }

    @Test
    void handleWebhook_paymentCodeFromCodeField_shouldParseSuccessfully() {
        // GIVEN
        PaymentWebhookRequest request = buildWebhookRequest();
        request.setContent(null);
        request.setCode("pay1755000000000");
        Payment pendingPayment = buildPendingPayment();

        when(paymentRepository.findBySepayTransactionId(123L)).thenReturn(Optional.empty());
        when(paymentRepository.findByOrderCode(1755000000000L)).thenReturn(Optional.of(pendingPayment));
        when(paymentRepository.save(any(Payment.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(walletService.credit(1, currencyItem.getEffectValue())).thenReturn(wallet);
        when(transactionService.handleCreateTransaction(any(Transaction.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // WHEN
        paymentService.handleWebhook(request, "Apikey secret-key");

        // THEN
        verify(paymentRepository).findByOrderCode(1755000000000L);
        verify(walletService).credit(1, currencyItem.getEffectValue());
    }
}