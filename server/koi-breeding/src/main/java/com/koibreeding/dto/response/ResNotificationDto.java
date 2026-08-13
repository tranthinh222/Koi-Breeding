package com.koibreeding.dto.response;

import java.time.OffsetDateTime;

import com.koibreeding.enums.NotificationType;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ResNotificationDto {
    private Integer id;
    private NotificationType type;
    private String title;
    private String message;
    private Boolean isRead;
    private OffsetDateTime createdAt;
}
