package com.koibreeding.security;

import com.koibreeding.enums.Role;
import com.koibreeding.service.JwtService;
import com.koibreeding.repository.UserRepository;
import com.koibreeding.util.CookieUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final CookieUtil cookieUtil;

    // Ưu tiên lấy cookie, ko có cookie mới lấy header
    private String resolveToken(HttpServletRequest request){
        Optional<String> cookieToken = cookieUtil.getAccessToken(request);
        if(cookieToken.isPresent()){
            return cookieToken.get();
        }

        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")){
            return authHeader.substring(7);
        }
        return null;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
    String token = resolveToken(request);
    if (token != null && jwtService.isAccessTokenValid(token)){
        String username = jwtService.verifyToken(token);

        var user = userRepository.findByUsername(username).orElse(null);
        if (user != null){
            Role role = user.getRole() != null ? user.getRole() : Role.USER;

            var authToken = new UsernamePasswordAuthenticationToken(
                    username,
                    null,
                    List.of(new SimpleGrantedAuthority("ROLE_" + role.name()))
            );
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }
    }
    filterChain.doFilter(request, response);
    }

}