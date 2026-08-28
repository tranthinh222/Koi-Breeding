package com.koibreeding.dto.response;

import java.time.Instant;
import java.time.LocalDate;

import com.koibreeding.enums.Gender;
import com.koibreeding.enums.Location;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResUserDto {
    private long id;
    private String username;
    private String email;
    private LocalDate birthday;
    private Gender gender;
    private Integer exp;
    private String avatarUrl;
    private Location location;
    private Instant locationUpdatedAt;
    private Instant createdAt;
    private Instant updatedAt;
}
