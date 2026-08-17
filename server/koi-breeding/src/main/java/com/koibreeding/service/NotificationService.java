package com.koibreeding.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.koibreeding.domain.Notification;
import com.koibreeding.domain.User;
import com.koibreeding.dto.response.ResNotificationDto;
import com.koibreeding.enums.NotificationType;
import com.koibreeding.repository.NotificationRepository;
import com.koibreeding.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private static final long SSE_TIMEOUT_MS = 30 * 60 * 1000L;

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final Map<Integer, List<SseEmitter>> emitters = new ConcurrentHashMap<>();

    public List<ResNotificationDto> getNotifications(Integer userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toDto)
                .toList();
    }

    public SseEmitter subscribe(Integer userId) {
        SseEmitter emitter = new SseEmitter(SSE_TIMEOUT_MS);
        emitters.computeIfAbsent(userId, ignored -> new CopyOnWriteArrayList<>()).add(emitter);
        emitter.onCompletion(() -> removeEmitter(userId, emitter));
        emitter.onTimeout(() -> {
            emitter.complete();
            removeEmitter(userId, emitter);
        });
        return emitter;
    }

    public ResNotificationDto createAndSend(Integer userId, NotificationType type, String title, String message) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification = notificationRepository.save(notification);

        ResNotificationDto dto = toDto(notification);
        emitters.getOrDefault(userId, List.of()).forEach(emitter -> send(userId, emitter, dto));
        return dto;
    }

    public void markAllRead(Integer userId) {
        notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).forEach(notification -> notification.setIsRead(true));
        notificationRepository.flush();
    }

    private void send(Integer userId, SseEmitter emitter, ResNotificationDto notification) {
        try {
            emitter.send(SseEmitter.event().name("notification").data(notification));
        } catch (IOException exception) {
            emitter.completeWithError(exception);
            removeEmitter(userId, emitter);
        }
    }

    private void removeEmitter(Integer userId, SseEmitter emitter) {
        emitters.computeIfPresent(userId, (ignored, userEmitters) -> {
            userEmitters.remove(emitter);
            return userEmitters.isEmpty() ? null : userEmitters;
        });
    }

    private ResNotificationDto toDto(Notification notification) {
        return new ResNotificationDto(notification.getId(), notification.getType(), notification.getTitle(),
                notification.getMessage(), notification.getIsRead(), notification.getCreatedAt());
    }
}
