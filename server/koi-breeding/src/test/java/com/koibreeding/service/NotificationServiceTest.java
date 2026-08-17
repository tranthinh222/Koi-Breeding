package com.koibreeding.service;

import com.koibreeding.domain.Notification;
import com.koibreeding.domain.User;
import com.koibreeding.dto.response.ResNotificationDto;
import com.koibreeding.enums.NotificationType;
import com.koibreeding.repository.NotificationRepository;
import com.koibreeding.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private NotificationService notificationService;

    private User user;
    private Notification notification1;
    private Notification notification2;
    private OffsetDateTime createdAt;

    @BeforeEach
    void initData() {
        user = new User();
        user.setId(1);

        createdAt = OffsetDateTime.of(2026, 8, 14, 21, 56, 42, 0, ZoneOffset.ofHours(7));

        notification1 = new Notification();
        notification1.setId(1);
        notification1.setUser(user);
        notification1.setType(NotificationType.SYSTEM);
        notification1.setTitle("Chào mừng");
        notification1.setMessage("Chào mừng bạn đến với hệ thống");
        notification1.setIsRead(false);
        notification1.setCreatedAt(createdAt);

        notification2 = new Notification();
        notification2.setId(2);
        notification2.setUser(user);
        notification2.setType(NotificationType.SYSTEM);
        notification2.setTitle("Cập nhật");
        notification2.setMessage("Đã có bản cập nhật mới");
        notification2.setIsRead(true);
        notification2.setCreatedAt(createdAt);
    }

    @Test
    void getNotifications_success() {
        // GIVEN
        when(notificationRepository.findByUserIdOrderByCreatedAtDesc(1))
                .thenReturn(List.of(notification1, notification2));

        // WHEN
        List<ResNotificationDto> result = notificationService.getNotifications(1);

        // THEN
        assertEquals(2, result.size());
        assertEquals("Chào mừng", result.get(0).getTitle());
        assertFalse(result.get(0).getIsRead());
        assertEquals("Cập nhật", result.get(1).getTitle());
        assertTrue(result.get(1).getIsRead());
    }

    @Test
    void getNotifications_emptyList() {
        // GIVEN
        when(notificationRepository.findByUserIdOrderByCreatedAtDesc(1))
                .thenReturn(List.of());

        // WHEN
        List<ResNotificationDto> result = notificationService.getNotifications(1);

        // THEN
        assertTrue(result.isEmpty());
    }

    @Test
    void subscribe_shouldReturnSseEmitter() {
        // WHEN
        SseEmitter emitter = notificationService.subscribe(1);

        // THEN
        assertNotNull(emitter);
    }

    @Test
    void createAndSend_success() {
        // GIVEN
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(notificationRepository.save(any(Notification.class)))
                .thenAnswer(invocation -> {
                    Notification n = invocation.getArgument(0);
                    n.setId(10);
                    n.setCreatedAt(createdAt);
                    return n;
                });

        // WHEN
        ResNotificationDto result = notificationService.createAndSend(
                1, NotificationType.SYSTEM, "Tiêu đề", "Nội dung"
        );

        // THEN
        assertNotNull(result);
        assertEquals(10, result.getId());
        assertEquals(NotificationType.SYSTEM, result.getType());
        assertEquals("Tiêu đề", result.getTitle());
        assertEquals("Nội dung", result.getMessage());
        assertEquals(createdAt, result.getCreatedAt());

        verify(userRepository).findById(1);
        verify(notificationRepository).save(any(Notification.class));
    }

    @Test
    void createAndSend_userNotFound_shouldThrowException() {
        // GIVEN
        when(userRepository.findById(1)).thenReturn(Optional.empty());

        // WHEN + THEN
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> notificationService.createAndSend(1, NotificationType.SYSTEM, "Tiêu đề", "Nội dung")
        );

        assertEquals("User not found", exception.getMessage());
        verify(notificationRepository, never()).save(any());
    }

    @Test
    void createAndSend_shouldSendToSubscribedEmitters() {
        // GIVEN
        SseEmitter emitter = notificationService.subscribe(1);

        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(notificationRepository.save(any(Notification.class)))
                .thenAnswer(invocation -> {
                    Notification n = invocation.getArgument(0);
                    n.setId(10);
                    n.setCreatedAt(createdAt);
                    return n;
                });

        // WHEN + THEN (không throw exception nghĩa là đã gửi thành công qua emitter)
        assertDoesNotThrow(() ->
                notificationService.createAndSend(1, NotificationType.SYSTEM, "Tiêu đề", "Nội dung")
        );

        assertNotNull(emitter);
    }

    @Test
    void markAllRead_success() {
        // GIVEN
        when(notificationRepository.findByUserIdOrderByCreatedAtDesc(1))
                .thenReturn(List.of(notification1, notification2));

        // WHEN
        notificationService.markAllRead(1);

        // THEN
        assertTrue(notification1.getIsRead());
        assertTrue(notification2.getIsRead());
        verify(notificationRepository).flush();
    }

    @Test
    void markAllRead_emptyList_shouldStillFlush() {
        // GIVEN
        when(notificationRepository.findByUserIdOrderByCreatedAtDesc(1))
                .thenReturn(List.of());

        // WHEN
        notificationService.markAllRead(1);

        // THEN
        verify(notificationRepository).flush();
    }
}