package com.koibreeding.dto.response;

import com.koibreeding.enums.Gender;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResAuthDto {
    private String username;
    private String email;
    private LocalDate birthday;
    private Gender gender;
    private String password;
    private String confirmPassword;
    private Integer exp;
    private String avatarUrl;
}
