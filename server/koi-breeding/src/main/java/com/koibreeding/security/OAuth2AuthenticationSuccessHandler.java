package com.koibreeding.security;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.koibreeding.domain.Pond;
import com.koibreeding.domain.User;
import com.koibreeding.enums.PhTrend;
import com.koibreeding.enums.Role;
import com.koibreeding.repository.PondRepository;
import com.koibreeding.repository.UserRepository;
import com.koibreeding.service.JwtService;
import com.koibreeding.util.CookieUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final CookieUtil cookieUtil;
    private final PondRepository pondRepository;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {

        // 1. Get user's information from Google response
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        // 2. Get User from DB (already created/updated from previous
        // CustomOAuth2UserService)
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found after OAuth2 login"));

        // 3. Generate access token & refresh token
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        // Repair accounts created before starter-pond onboarding was added.
        if (pondRepository.findFirstByOwner_IdOrderByIdAsc(user.getId()).isEmpty()) {
            createStarterPond(user);
        }

        // 4. Set token into Cookie (The same with login local flow in AuthController)
        cookieUtil.addAccessTokenCookie(response, accessToken);
        cookieUtil.addRefreshTokenCookie(response, refreshToken);

        // 5. Redirect directly to home page of frontend
        String page = (user.getRole().equals(Role.USER)) ? "/home" : "/admin";
        getRedirectStrategy().sendRedirect(request, response, frontendUrl + page);
    }

    private void createStarterPond(User owner) {
        Pond pond = new Pond();
        pond.setOwner(owner);
        pond.setName("Starter Pond");
        pond.setDescription("Your first pond for raising koi.");
        pond.setLevel(1);
        pond.setCapacity(1);
        pond.setWaterQuality(BigDecimal.valueOf(100));
        pond.setTemperature(BigDecimal.valueOf(25));
        pond.setPH(BigDecimal.valueOf(7));
        pond.setOxygen(BigDecimal.valueOf(6.8));
        pond.setPhTrend(PhTrend.ALKALINE);
        pond.setPhTrendChangedAt(OffsetDateTime.now());
        pondRepository.save(pond);
    }
}
