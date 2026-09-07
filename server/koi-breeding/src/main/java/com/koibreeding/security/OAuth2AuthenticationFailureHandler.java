package com.koibreeding.security;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2AuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler {

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException exception) throws IOException, ServletException {
        // 1. Get error message from Spring Security or from CustomOAuth2UserService
        String errorMessage = exception.getLocalizedMessage();

        // 2. Encode the error string to ensure safety when attaching it to a URL (avoid
        // issues with spaces or special characters
        String encodedError = URLEncoder.encode(errorMessage, StandardCharsets.UTF_8.toString());

        // 3. Build redirect URL to Frontend and attach error parameter
        // Ex: http://localhost:5173/login?error=Access%20Denied
        String targetUrl = frontendUrl + "/login?error=" + encodedError;

        // 4. Redirect
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
