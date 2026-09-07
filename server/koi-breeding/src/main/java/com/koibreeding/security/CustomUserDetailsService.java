package com.koibreeding.security;

import com.koibreeding.repository.UserRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

import com.koibreeding.enums.Role;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String loginInput) throws UsernameNotFoundException {
        var user = userRepository.findByUsername(loginInput)
                .or(() -> userRepository.findByEmail(loginInput))
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + loginInput));

        boolean isLocked = Boolean.TRUE.equals(user.getIsBanned());

        var authorities = user.getRole() == Role.SUPER_ADMIN
                ? List.of(
                        new SimpleGrantedAuthority("ROLE_SUPER_ADMIN"),
                        new SimpleGrantedAuthority("ROLE_ADMIN"))
                : List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .authorities(authorities)
                .accountLocked(isLocked)
                .build();
    }
}
