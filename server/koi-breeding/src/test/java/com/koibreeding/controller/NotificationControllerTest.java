//package com.koibreeding.controller;
//
//import com.koibreeding.dto.response.ResNotificationDto;
//import com.koibreeding.enums.NotificationType;
//import com.koibreeding.service.NotificationService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
//
//import java.time.OffsetDateTime;
//import java.time.ZoneOffset;
//import java.util.List;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.Mockito.*;
//
//@ExtendWith(MockitoExtension.class)
//class NotificationControllerTest {
//
//    @Mock
//    private NotificationService notificationService;
//
//    @InjectMocks
//    private NotificationController notificationController;
//
//    private ResNotificationDto notification1;
//    private ResNotificationDto notification2;
//    private OffsetDateTime createdAt;
//
//    @BeforeEach
//    void initData() {
//        createdAt = OffsetDateTime.of(2026, 8, 14, 21, 56, 42, 0, ZoneOffset.ofHours(7));
//
//        notification1 = new ResNotificationDto(
//                1,
//                NotificationType.PURCHASE_SUCCESS,
//                "Buy fish",
//                "Buy 10 fish",
//                false,
//                createdAt);
//
//        notification2 = new ResNotificationDto(
//                2,
//                NotificationType.PURCHASE_SUCCESS,
//                "Buy food",
//                "Buy 10 food",
//                true,
//                createdAt);
//    }
//
//    @Test
//    void getNotifications_success() {
//        // GIVEN
//        when(notificationService.getNotifications(1))
//                .thenReturn(List.of(notification1, notification2));
//
//        // WHEN
//        ResponseEntity<List<ResNotificationDto>> result = notificationController.getNotifications(1);
//
//        // THEN
//        assertEquals(HttpStatus.OK, result.getStatusCode());
//        assertNotNull(result.getBody());
//        assertEquals(2, result.getBody().size());
//
//        // Notification 1
//        assertEquals(
//                NotificationType.PURCHASE_SUCCESS,
//                result.getBody().get(0).getType());
//        assertEquals(
//                "Buy fish",
//                result.getBody().get(0).getTitle());
//        assertEquals(
//                "Buy 10 fish",
//                result.getBody().get(0).getMessage());
//        assertEquals(
//                createdAt,
//                result.getBody().get(0).getCreatedAt());
//        assertFalse(
//                result.getBody().get(0).getIsRead());
//
//        // Notification 2
//        assertEquals(
//                NotificationType.PURCHASE_SUCCESS,
//                result.getBody().get(1).getType());
//        assertEquals(
//                "Buy food",
//                result.getBody().get(1).getTitle());
//        assertEquals(
//                "Buy 10 food",
//                result.getBody().get(1).getMessage());
//        assertEquals(
//                createdAt,
//                result.getBody().get(1).getCreatedAt());
//        assertTrue(
//                result.getBody().get(1).getIsRead());
//
//        verify(notificationService).getNotifications(1);
//    }
//
//    @Test
//    void getNotifications_emptyList() {
//        // GIVEN
//        when(notificationService.getNotifications(1))
//                .thenReturn(List.of());
//
//        // WHEN
//        ResponseEntity<List<ResNotificationDto>> result = notificationController.getNotifications(1);
//
//        // THEN
//        assertEquals(HttpStatus.OK, result.getStatusCode());
//        assertNotNull(result.getBody());
//        assertTrue(result.getBody().isEmpty());
//    }
//
//    @Test
//    void subscribe_success() {
//        // GIVEN
//        SseEmitter emitter = new SseEmitter();
//        when(notificationService.subscribe(1)).thenReturn(emitter);
//
//        // WHEN
//        SseEmitter result = notificationController.subscribe(1);
//
//        // THEN
//        assertNotNull(result);
//        assertEquals(emitter, result);
//        verify(notificationService).subscribe(1);
//    }
//
//    @Test
//    void markAllRead_success() {
//        // WHEN
//        ResponseEntity<Void> result = notificationController.markAllRead(1);
//
//        // THEN
//        assertEquals(HttpStatus.NO_CONTENT, result.getStatusCode());
//        assertNull(result.getBody());
//        verify(notificationService).markAllRead(1);
//    }
//}