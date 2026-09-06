package com.koibreeding.service;

import com.koibreeding.domain.User;
import com.koibreeding.dto.request.ForgotPasswordRequest;
import com.koibreeding.dto.request.LoginRequest;
import com.koibreeding.dto.request.ResetPasswordRequest;
import com.koibreeding.dto.request.VerifyResetCodeRequest;
import com.koibreeding.dto.response.LoginResponse;
import com.koibreeding.dto.response.ResAuthDto;
import com.koibreeding.dto.response.ResUserDto;
import com.koibreeding.enums.Gender;
import com.koibreeding.enums.Location;
import com.koibreeding.enums.Role;
import com.koibreeding.enums.UserStatus;
import com.koibreeding.repository.AuthRepository;
import com.koibreeding.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.val;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

import jakarta.mail.internet.MimeMessage;

import javax.security.sasl.AuthenticationException;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthRepository authRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final JavaMailSender mailSender;
    private final Map<String, ResetCodeInfo> resetCodeCache = new ConcurrentHashMap<>();

    @Value("${spring.mail.username:}")
    private String mailFrom;
    private static final Duration RESET_CODE_TTL = Duration.ofMinutes(15);

    private static class ResetCodeInfo {
        private final String code;
        private final Instant expiresAt;

        private ResetCodeInfo(String code, Instant expiresAt) {
            this.code = code;
            this.expiresAt = expiresAt;
        }
    }

    public ResUserDto SignUp(ResAuthDto userRes) {
        if (userRepository.existsByUsername(userRes.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(userRes.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (!userRes.getConfirmPassword().equals(userRes.getPassword())) {
            throw new RuntimeException("Password confirm does not match");
        }

        validateStrongPassword(userRes.getPassword());

        String hashPassword = passwordEncoder.encode(userRes.getPassword());
        User user = new User();
        user.setUsername(userRes.getUsername());
        user.setEmail(userRes.getEmail());
        user.setBirthday(userRes.getBirthday());
        user.setGender(userRes.getGender());
        user.setLocation(userRes.getLocation());
        user.setExp(1);
        user.setAvatarUrl(userRes.getAvatarUrl());
        user.setStatus(UserStatus.ACTIVE);
        user.setIsBanned(false);
        user.setRole(Role.USER);
        user.setPassword(hashPassword);
        user.setCreatedAt(Instant.now());
        user.setUpdatedAt(Instant.now());

        User newUser = userRepository.save(user);
        return new ResUserDto(
                newUser.getId(),
                newUser.getUsername(),
                newUser.getEmail(),
                newUser.getBirthday(),
                newUser.getGender(),
                newUser.getLocation(),
                newUser.getRole(),
                newUser.getExp(),
                newUser.getAvatarUrl(),
                newUser.getCreatedAt(),
                newUser.getUpdatedAt());
    }

    public LoginResponse Login(LoginRequest request) {

        String loginInput = (request.getUsername() != null && !request.getUsername().isBlank())
                ? request.getUsername()
                : request.getEmail();

        User user = userRepository.findByUsername(loginInput)
                .orElseGet(() ->
                        userRepository.findByEmail(loginInput)
                                .orElseThrow(() ->
                                        new RuntimeException("Invalid username/email or password")
                                )
                );

        // 1. Kiểm tra tài khoản đã bị ban
        if (Boolean.TRUE.equals(user.getIsBanned())) {
            throw new RuntimeException("Your account has been banned");
        }

        try {

            // 2. Authentication
            Authentication authentication =
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    loginInput,
                                    request.getPassword()
                            )
                    );

            // 3. Login thành công → reset số lần sai
            user.setFailedLoginAttempts(0);
            userRepository.save(user);

            // 4. Tạo token
            String accessToken = jwtService.generateAccessToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);

            return new LoginResponse(accessToken, refreshToken);

        } catch (org.springframework.security.core.AuthenticationException e) {

            // 5. Login sai
            int failedAttempts = user.getFailedLoginAttempts() + 1;

            user.setFailedLoginAttempts(failedAttempts);

            // 6. Sai đủ 5 lần → ban
            if (failedAttempts >= 5) {
                user.setIsBanned(true);
                userRepository.save(user);

                throw new RuntimeException(
                        "Your account has been banned after 5 failed login attempts"
                );
            }

            userRepository.save(user);

            throw new RuntimeException(
                    "Invalid username/email or password. Attempt "
                            + failedAttempts + "/5"
            );
        }
    }

    public String refresh(String refreshToken) {

        if (refreshToken == null || !jwtService.isRefreshTokenValid(refreshToken)) {
            throw new RuntimeException("Invalid or expired refresh token");
        }

        String username = jwtService.verifyToken(refreshToken);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        return jwtService.generateAccessToken(user);
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email does not exist"));

        String code = generateResetCode();
        resetCodeCache.put(user.getEmail().trim().toLowerCase(),
                new ResetCodeInfo(code, Instant.now().plus(RESET_CODE_TTL)));

        sendResetCodeEmail(user.getEmail(), code);
    }

    public void verifyResetCode(VerifyResetCodeRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email does not exist"));
        validateResetCode(user, request.getCode());
    }

    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email does not exist"));

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Password confirm does not match");
        }

        validateStrongPassword(request.getNewPassword());

        validateResetCode(user, request.getCode());

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        resetCodeCache.remove(user.getEmail().trim().toLowerCase());
        userRepository.save(user);
    }

    private void validateResetCode(User user, String code) {
        String emailKey = user.getEmail().trim().toLowerCase();
        ResetCodeInfo resetCodeInfo = resetCodeCache.get(emailKey);
        String normalizedCode = code != null ? code.trim() : "";

        if (resetCodeInfo == null) {
            throw new RuntimeException("Reset code is invalid or expired");
        }

        if (resetCodeInfo.expiresAt.isBefore(Instant.now())) {
            resetCodeCache.remove(emailKey);
            throw new RuntimeException("Reset code is expired");
        }

        if (!resetCodeInfo.code.equals(normalizedCode)) {
            throw new RuntimeException("Reset code is incorrect");
        }
    }

    private void validateStrongPassword(String password) {
        if (password == null || password.length() < 8) {
            throw new RuntimeException(
                    "Password must contain at least 8 characters, 1 uppercase letter, 1 number, and 1 special character");
        }

        if (!password.matches(".*[A-Z].*")) {
            throw new RuntimeException(
                    "Password must contain at least 8 characters, 1 uppercase letter, 1 number, and 1 special character");
        }

        if (!password.matches(".*\\d.*")) {
            throw new RuntimeException(
                    "Password must contain at least 8 characters, 1 uppercase letter, 1 number, and 1 special character");
        }

        if (!password.matches(".*[^A-Za-z0-9].*")) {
            throw new RuntimeException(
                    "Password must contain at least 8 characters, 1 uppercase letter, 1 number, and 1 special character");
        }
    }

    private String generateResetCode() {
        return String.format("%06d", new Random().nextInt(1_000_000));
    }

    private void sendResetCodeEmail(String email, String code) {
        try {
            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject("Koi Breeding - Password Reset Code");
            String html = """
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #f5f5f5;
                                margin: 0;
                                padding: 30px;
                            }

                            .container {
                                max-width: 500px;
                                margin: 0 auto;
                                background-color: white;
                                padding: 30px;
                                border-radius: 12px;
                                text-align: center;
                            }

                            .title {
                                font-size: 26px;
                                font-weight: bold;
                                margin-bottom: 15px;
                            }

                            .description {
                                font-size: 15px;
                                color: #555555;
                                line-height: 1.6;
                            }

                            .code {
                                font-size: 36px;
                                font-weight: bold;
                                letter-spacing: 8px;
                                margin: 25px 0;
                            }

                            .expiration {
                                font-size: 14px;
                                color: #888888;
                            }

                            .warning {
                                font-size: 13px;
                                color: #999999;
                                margin-top: 25px;
                            }

                            .footer {
                                margin-top: 30px;
                                font-size: 13px;
                                color: #777777;
                            }
                        </style>
                    </head>

                    <body>
                        <div class="container">

                            <div class="title">
                                Password Reset
                            </div>

                            <p class="description">
                                We received a request to reset your
                                <strong>Koi Breeding</strong> account password.
                            </p>

                            <p class="description">
                                Your verification code is:
                            </p>

                            <div class="code">
                                %s
                            </div>

                            <p class="expiration">
                                This code will expire in <strong>15 minutes</strong>.
                            </p>

                            <p class="warning">
                                If you did not request a password reset,
                                you can safely ignore this email.
                            </p>

                            <div class="footer">
                                Best regards,<br>
                                <strong>Koi Breeding Team</strong>
                            </div>

                        </div>
                    </body>
                    </html>
                    """
                    .formatted(code);
            helper.setText(html, true);

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send reset password email", e);
        }

    }
}
