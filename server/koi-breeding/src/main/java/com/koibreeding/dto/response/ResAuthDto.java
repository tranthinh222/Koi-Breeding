package com.koibreeding.dto.response;

import com.koibreeding.enums.Gender;
import com.koibreeding.enums.Location;
import lombok.*;

import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResAuthDto {
    @Pattern(regexp = "^[A-Za-z0-9_]+$", message = "Username may only contain ASCII letters, numbers, and underscores without spaces")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;
    private String email;
    @PastOrPresent(message = "Birthday cannot be later than today")
    private LocalDate birthday;
    private Gender gender;
    private Location location;
    @Pattern(regexp = "^[!-~]+$", message = "Password may only contain printable ASCII characters without spaces")
    @Size(min = 8, max = 64, message = "Password must be between 8 and 64 characters")
    private String password;
    private String confirmPassword;
    private Integer level;
    private String avatarUrl;
}
