package com.koibreeding.service;

import com.koibreeding.domain.User;
import com.koibreeding.dto.request.ForgotPasswordRequest;
import com.koibreeding.dto.request.LoginRequest;
import com.koibreeding.dto.request.ResetPasswordRequest;
import com.koibreeding.dto.response.LoginResponse;
import com.koibreeding.dto.response.ResAuthDto;
import com.koibreeding.enums.Gender;
import com.koibreeding.repository.AuthRepository;
import com.koibreeding.repository.UserRepository;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.lang.reflect.Field;
import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthRepository authRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @Mock
    private JavaMailSender mailSender;

    private PasswordEncoder passwordEncoder;
    private AuthService authService;
    private User user;

    @BeforeEach
    void setUp() {
        passwordEncoder = new BCryptPasswordEncoder();
        authService = new AuthService(
                authRepository,
                userRepository,
                passwordEncoder,
                authenticationManager,
                jwtService,
                mailSender
        );

        user = new User();
        user.setId(1);
        user.setUsername("alice");
        user.setEmail("alice@example.com");
        user.setPassword(passwordEncoder.encode("StrongPass1!"));
        user.setBirthday(LocalDate.of(2000, 1, 15));
        user.setGender(Gender.FEMALE);
    }

    @Test
    void login_success() {
        LoginRequest request = new LoginRequest();
        request.setUsername("alice");
        request.setPassword("StrongPass1!");

        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(user));
        when(jwtService.generateUserToken(1)).thenReturn("user-token");
        when(jwtService.generateRefreshToken(1)).thenReturn("refresh-token");

        LoginResponse response = authService.Login(request);

        assertNotNull(response);
        assertEquals("user-token", response.getUserToken());
        assertEquals("refresh-token", response.getRefreshToken());
    }

    @Test
    void login_throw_when_username_does_not_exist() {
        LoginRequest request = new LoginRequest();
        request.setUsername("ghost");
        request.setEmail("ghost@example.com");
        request.setPassword("StrongPass1!");

        when(userRepository.findByUsername("ghost")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("ghost@example.com")).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> authService.Login(request)
        );

        assertEquals("Incorrect username or email", exception.getMessage());
    }

    @Test
    void login_throw_when_password_is_incorrect() {
        LoginRequest request = new LoginRequest();
        request.setUsername("alice");
        request.setPassword("WrongPass1!");

        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(user));

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> authService.Login(request)
        );

        assertEquals("Incorrect password", exception.getMessage());
    }

    @Test
    void signUp_success() {
        ResAuthDto request = new ResAuthDto();
        request.setUsername("bob");
        request.setEmail("bob@example.com");
        request.setBirthday(LocalDate.of(1998, 3, 10));
        request.setGender(Gender.MALE);
        request.setPassword("StrongPass1!");
        request.setConfirmPassword("StrongPass1!");

        when(userRepository.existsByUsername("bob")).thenReturn(false);
        when(userRepository.existsByEmail("bob@example.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User saved = invocation.getArgument(0);
            saved.setId(2);
            return saved;
        });

        var result = authService.SignUp(request);

        assertNotNull(result);
        assertEquals("bob", result.getUsername());
        assertEquals("bob@example.com", result.getEmail());
        assertEquals(1, result.getExp());
    }

    @Test
    void signUp_throw_when_username_exists() {
        ResAuthDto request = new ResAuthDto();
        request.setUsername("alice");
        request.setEmail("new@example.com");
        request.setBirthday(LocalDate.of(1999, 5, 12));
        request.setGender(Gender.MALE);
        request.setPassword("StrongPass1!");
        request.setConfirmPassword("StrongPass1!");

        when(userRepository.existsByUsername("alice")).thenReturn(true);

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> authService.SignUp(request)
        );

        assertEquals("Username already exists", exception.getMessage());
    }

    @Test
    void signUp_throw_when_email_exists() {
        ResAuthDto request = new ResAuthDto();
        request.setUsername("charlie");
        request.setEmail("alice@example.com");
        request.setBirthday(LocalDate.of(1999, 5, 12));
        request.setGender(Gender.MALE);
        request.setPassword("StrongPass1!");
        request.setConfirmPassword("StrongPass1!");

        when(userRepository.existsByUsername("charlie")).thenReturn(false);
        when(userRepository.existsByEmail("alice@example.com")).thenReturn(true);

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> authService.SignUp(request)
        );

        assertEquals("Email already exists", exception.getMessage());
    }

    @Test
    void signUp_throw_when_confirm_password_does_not_match() {
        ResAuthDto request = new ResAuthDto();
        request.setUsername("diana");
        request.setEmail("diana@example.com");
        request.setBirthday(LocalDate.of(2001, 9, 25));
        request.setGender(Gender.FEMALE);
        request.setPassword("StrongPass1!");
        request.setConfirmPassword("DifferentPass1!");

        when(userRepository.existsByUsername("diana")).thenReturn(false);
        when(userRepository.existsByEmail("diana@example.com")).thenReturn(false);

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> authService.SignUp(request)
        );

        assertEquals("Password confirm does not match", exception.getMessage());
    }

    @Test
    void forgotPassword_success() throws Exception {
        when(userRepository.findByEmail("alice@example.com")).thenReturn(Optional.of(user));
        when(mailSender.createMimeMessage()).thenReturn(mock(MimeMessage.class));

        authService.forgotPassword(new ForgotPasswordRequest("alice@example.com"));

        Map<String, ?> resetCodeCache = getResetCodeCache();
        assertEquals(1, resetCodeCache.size());
        assertTrue(resetCodeCache.containsKey("alice@example.com"));
        verify(mailSender).send(any(MimeMessage.class));
    }

    @Test
    void forgotPassword_throw_when_email_does_not_exist() {
        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> authService.forgotPassword(new ForgotPasswordRequest("missing@example.com"))
        );

        assertEquals("Email does not exist", exception.getMessage());
    }

    @Test
    void resetPassword_success() throws Exception {
        when(userRepository.findByEmail("alice@example.com")).thenReturn(Optional.of(user));
        when(mailSender.createMimeMessage()).thenReturn(mock(MimeMessage.class));

        authService.forgotPassword(new ForgotPasswordRequest("alice@example.com"));

        String resetCode = extractResetCode("alice@example.com");
        ResetPasswordRequest request = new ResetPasswordRequest(
                "alice@example.com",
                resetCode,
                "NewStrongPass1!",
                "NewStrongPass1!"
        );

        authService.resetPassword(request);

        assertTrue(passwordEncoder.matches("NewStrongPass1!", user.getPassword()));
        verify(userRepository, atLeastOnce()).save(user);
    }

    @Test
    void resetPassword_throw_when_email_does_not_exist() {
        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> authService.resetPassword(new ResetPasswordRequest(
                        "missing@example.com",
                        "123456",
                        "NewStrongPass1!",
                        "NewStrongPass1!"
                ))
        );

        assertEquals("Email does not exist", exception.getMessage());
    }

    @Test
    void resetPassword_throw_when_code_is_incorrect() {
        when(userRepository.findByEmail("alice@example.com")).thenReturn(Optional.of(user));
        when(mailSender.createMimeMessage()).thenReturn(mock(MimeMessage.class));

        authService.forgotPassword(new ForgotPasswordRequest("alice@example.com"));

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> authService.resetPassword(new ResetPasswordRequest(
                        "alice@example.com",
                        "000000",
                        "NewStrongPass1!",
                        "NewStrongPass1!"
                ))
        );

        assertEquals("Reset code is incorrect", exception.getMessage());
    }

    @SuppressWarnings("unchecked")
    private Map<String, ?> getResetCodeCache() throws Exception {
        Field field = AuthService.class.getDeclaredField("resetCodeCache");
        field.setAccessible(true);
        return (Map<String, ?>) field.get(authService);
    }

    private String extractResetCode(String email) throws Exception {
        Object resetCodeInfo = getResetCodeCache().get(email.trim().toLowerCase());
        Field codeField = resetCodeInfo.getClass().getDeclaredField("code");
        codeField.setAccessible(true);
        return (String) codeField.get(resetCodeInfo);
    }
}
// mvn test -Dtest=AuthServiceTest