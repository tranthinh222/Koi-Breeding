package com.koibreeding.service;

import com.koibreeding.domain.User;
import com.koibreeding.dto.request.LoginRequest;
import com.koibreeding.dto.response.LoginResponse;
import com.koibreeding.dto.response.ResAuthDto;
import com.koibreeding.dto.response.ResUserDto;
import com.koibreeding.enums.Gender;
import com.koibreeding.enums.Role;
import com.koibreeding.enums.UserStatus;
import com.koibreeding.repository.AuthRepository;
import com.koibreeding.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.val;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.security.sasl.AuthenticationException;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthRepository authRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    public ResUserDto SignUp(ResAuthDto userRes){
        if(userRepository.existsByUsername(userRes.getUsername())){
            throw new RuntimeException("Username already exists");
        }

        if(userRepository.existsByEmail(userRes.getEmail())){
            throw new RuntimeException("Email already exists");
        }

        if(!userRes.getConfirmPassword().equals(userRes.getPassword())){
            throw new RuntimeException("Password confirm does not match");
        }

        String hashPassword = passwordEncoder.encode(userRes.getPassword());
        User user = new User();
        user.setUsername(userRes.getUsername());
        user.setEmail(userRes.getEmail());
        user.setBirthday(userRes.getBirthday());
        user.setGender(userRes.getGender());
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
                newUser.getExp(),
                newUser.getAvatarUrl(),
                newUser.getCreatedAt(),
                newUser.getUpdatedAt()
        );
    }

    public LoginResponse Login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseGet(() -> userRepository.findByEmail(request.getEmail())
                        .orElseThrow(() ->
                                new RuntimeException("Incorrect username or email")
                        ));
        if(passwordEncoder.matches(
                user.getPassword(),
                request.getPassword()
        )){
            throw new RuntimeException("Incorrect password");
        }

        String userToken = jwtService.generateUserToken(user.getId());
        String refreshToken = jwtService.generateRefreshToken(user.getId());

        return new LoginResponse(userToken, refreshToken);
    }
}
