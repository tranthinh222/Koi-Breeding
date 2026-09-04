package com.koibreeding.dto.request;

import com.koibreeding.enums.UserStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminUpdateUserRequest {
    @NotNull
    private Integer id;

    private String password;

    private UserStatus status;

    private String reason;
}