package com.koibreeding.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
   private String userToken;
   private String refreshToken;
}
