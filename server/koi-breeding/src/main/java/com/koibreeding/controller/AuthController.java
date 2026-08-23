package com.koibreeding.controller;

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
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

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
        cookieUtil.addUserTokenCookie(response, result.getUserToken());
        cookieUtil.addRefreshTokenCookie(response, result.getRefreshToken());
        return ResponseEntity.status(HttpStatus.OK).body(result);
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

        Integer userId = Integer.valueOf(authentication.getName());
        return ResponseEntity.ok(userService.convertToResUserDto(userService.handleFetchProfileByUserId(userId)));
    }

    @PostMapping("/auth/logout")
    @ApiMessage("Logout successfully")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        cookieUtil.clearAuthCookies(response);
        return ResponseEntity.ok().build();
    }
}
