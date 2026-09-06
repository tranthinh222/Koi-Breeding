package com.koibreeding.dto.response.admin;

import com.koibreeding.enums.Gender;
import com.koibreeding.enums.Role;
import com.koibreeding.enums.UserStatus;
import java.time.Instant;
import java.time.LocalDate;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AdminUserDto {
    private Integer id;
    private String username;
    private String email;
    private LocalDate birthday;
    private Gender gender;
    private Role role;
    private UserStatus status;
    private Boolean isBanned;
    private Integer exp;
    private String avatarUrl;
    private Instant createdAt;
    private Instant updatedAt;
}