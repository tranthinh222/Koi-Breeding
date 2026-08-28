package com.koibreeding.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.koibreeding.dto.response.ResNotificationDto;
import com.koibreeding.service.NotificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class NotificationController {
    private final NotificationService notificationService;

    @GetMapping("/users/{userId}/notifications")
    public ResponseEntity<List<ResNotificationDto>> getNotifications(@PathVariable Integer userId) {
        return ResponseEntity.ok(notificationService.getNotifications(userId));
    }

    @GetMapping(value = "/users/{userId}/notifications/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(@PathVariable Integer userId) {
        return notificationService.subscribe(userId);
    }

    @PostMapping("/users/{userId}/notifications/read")
    public ResponseEntity<Void> markAllRead(@PathVariable Integer userId) {
        notificationService.markAllRead(userId);
        return ResponseEntity.noContent().build();
    }
}
