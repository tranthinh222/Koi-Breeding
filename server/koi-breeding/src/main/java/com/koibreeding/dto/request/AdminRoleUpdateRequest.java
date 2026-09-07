package com.koibreeding.dto.request;

import com.koibreeding.enums.Role;

import jakarta.validation.constraints.NotNull;

public record AdminRoleUpdateRequest(@NotNull Role role) {
}
