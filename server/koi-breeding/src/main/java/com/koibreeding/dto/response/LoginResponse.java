package com.koibreeding.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
   private String accessToken;
   private String refreshToken;
}
