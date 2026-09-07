package com.koibreeding.dto.request;

import com.koibreeding.enums.UserStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminModerationUserRequest {
    @NotNull
    private Integer id;
    private UserStatus status;
    private String reason;
}