package com.koibreeding.controller;

import com.koibreeding.domain.User;
import com.koibreeding.dto.request.LoginRequest;
import com.koibreeding.dto.request.ForgotPasswordRequest;
import com.koibreeding.dto.request.ResetPasswordRequest;
import com.koibreeding.dto.request.VerifyResetCodeRequest;
import com.koibreeding.dto.response.LoginResponse;
import com.koibreeding.dto.response.ResAuthDto;
import com.koibreeding.dto.response.ResUserDto;
import com.koibreeding.service.AuthService;
import com.koibreeding.service.UserService;
import com.koibreeding.util.CookieUtil;
import com.koibreeding.util.annotation.ApiMessage;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final UserService userService;
    private final CookieUtil cookieUtil;

    @PostMapping("/auth/register")
    @ApiMessage("Register success")
    public ResponseEntity<ResUserDto> register(
            @RequestBody ResAuthDto request) {
        return ResponseEntity.status(HttpStatus.OK).body(this.authService.SignUp(request));
    }

    @PostMapping("/auth/login")
    @ApiMessage("Login success")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request,
            HttpServletResponse response) {
        LoginResponse result = authService.Login(request);
        cookieUtil.addAccessTokenCookie(response, result.getAccessToken());
        cookieUtil.addRefreshTokenCookie(response, result.getRefreshToken());
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @PostMapping("/auth/refresh")
    @ApiMessage("Refresh token success")
    public ResponseEntity<?> refresh(
            HttpServletRequest request,
            HttpServletResponse response) {

        try {
            String refreshToken = cookieUtil.getRefreshToken(request)
                    .orElseThrow(() -> new RuntimeException("Refresh token not found"));

            String accessToken = authService.refresh(refreshToken);
            cookieUtil.addAccessTokenCookie(response, accessToken);

            return ResponseEntity.ok(new LoginResponse(accessToken, refreshToken));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/auth/forgot-password")
    @ApiMessage("Reset code sent successfully")
    public ResponseEntity<Void> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/auth/verify-reset-code")
    @ApiMessage("Reset code verified successfully")
    public ResponseEntity<Void> verifyResetCode(@RequestBody VerifyResetCodeRequest request) {
        authService.verifyResetCode(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/auth/reset-password")
    @ApiMessage("Password reset successfully")
    public ResponseEntity<Void> resetPassword(@RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/auth/me")
    @ApiMessage("Fetch current user successfully")
    public ResponseEntity<ResUserDto> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String username = authentication.getName();
        User user = userService.handleFetchUserByUsername(username);

        return ResponseEntity.ok(userService.convertToResUserDto(user));
    }

    @PostMapping("/auth/logout")
    @ApiMessage("Logout successfully")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        cookieUtil.clearAuthCookies(response);
        return ResponseEntity.ok().build();
    }
}
