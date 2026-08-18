package com.koibreeding.controller;

import com.koibreeding.dto.request.LoginRequest;
import com.koibreeding.dto.response.LoginResponse;
import com.koibreeding.dto.response.ResAuthDto;
import com.koibreeding.dto.response.ResUserDto;
import com.koibreeding.service.AuthService;
import com.koibreeding.util.CookieUtil;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final CookieUtil cookieUtil;

    @PostMapping("/auth/register")
    public ResponseEntity<ResUserDto> register(
            @RequestBody ResAuthDto request
    ){
        return ResponseEntity.status(HttpStatus.OK).body(this.authService.SignUp(request));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request,
            HttpServletResponse response
    ){
        LoginResponse result = authService.Login(request);
        cookieUtil.addUserTokenCookie(response, result.getUserToken());
        cookieUtil.addRefreshTokenCookie(response, result.getRefreshToken());
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }
}
