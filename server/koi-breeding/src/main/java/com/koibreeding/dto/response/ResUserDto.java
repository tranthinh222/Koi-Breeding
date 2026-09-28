package com.koibreeding.dto.response;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

import com.koibreeding.enums.Gender;
import com.koibreeding.enums.Location;
import com.koibreeding.enums.Role;

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
    @Builder.Default
    private List<ResBeautifulKoiDTO> mostBeautifulKoi = List.of();
    private long id;
    private String username;
    private String email;
    private LocalDate birthday;
    private Gender gender;
    private Role role;
    private Integer level;
    private long totalFish;
    private long marketplaceSales;
    private String avatarUrl;
    private Location location;
    private Instant locationUpdatedAt;
    private Instant createdAt;
    private Instant updatedAt;
}
