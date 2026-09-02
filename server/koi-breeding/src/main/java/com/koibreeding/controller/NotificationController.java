package com.koibreeding.controller;

import java.util.List;

import com.koibreeding.domain.User;
import com.koibreeding.service.JwtService;
import com.koibreeding.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.koibreeding.dto.response.ResNotificationDto;
import com.koibreeding.service.NotificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;
    private final UserService userService;
    private final JwtService jwtService;

    @GetMapping("/users/{userId}/notifications")
    public ResponseEntity<List<ResNotificationDto>> getNotifications(@PathVariable Integer userId) {
        return ResponseEntity.ok(notificationService.getNotifications(userId));
    }

    @GetMapping(
            value = "/users/{userId}/notifications/stream",
            produces = MediaType.TEXT_EVENT_STREAM_VALUE
    )
    public SseEmitter subscribe(
            @PathVariable Integer userId,
            Authentication authentication
    ) {

        String username = authentication.getName();

        User user =
                userService.handleFetchUserByUsername(username);

        if (!user.getId().equals(userId)) {
            throw new RuntimeException("User mismatch");
        }

        return notificationService.subscribe(userId);
    }

    @PostMapping("/users/{userId}/notifications/read")
    public ResponseEntity<Void> markAllRead(@PathVariable Integer userId) {
        notificationService.markAllRead(userId);
        return ResponseEntity.noContent().build();
    }
}
