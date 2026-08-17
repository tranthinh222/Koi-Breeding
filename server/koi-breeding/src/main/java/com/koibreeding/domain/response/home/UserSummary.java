package com.koibreeding.domain.response.home;

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

public class UserSummary {
    private Integer id;
    private String username;
    private String email;
    private Integer exp;
    private String avatarUrl;
}
