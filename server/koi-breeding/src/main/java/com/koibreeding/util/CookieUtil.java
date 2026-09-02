package com.koibreeding.util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class CookieUtil {
    private static final String ACCESS_TOKEN_COOKIE = "accessToken";
    private static final String REFRESH_TOKEN_COOKIE = "refreshToken";

    private static final int ACCESS_TOKEN_TIME = 30 * 60; //30 phút
    private static final int REFRESH_TOKEN_TIME = 7 * 24 * 60 * 60; //7 ngay

    public void addAccessTokenCookie(HttpServletResponse response, String token){
        ResponseCookie cookie = ResponseCookie.from(ACCESS_TOKEN_COOKIE, token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .sameSite("Lax")
                .maxAge(ACCESS_TOKEN_TIME)
                .build();
        response.addHeader("Set-Cookie", cookie.toString());
    }

    public void addRefreshTokenCookie(HttpServletResponse response, String token){
        ResponseCookie cookie = ResponseCookie.from(REFRESH_TOKEN_COOKIE, token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .sameSite("Lax")
                .maxAge(REFRESH_TOKEN_TIME)
                .build();
        response.addHeader("Set-Cookie", cookie.toString());
    }
    public void clearAuthCookies(HttpServletResponse response){
        ResponseCookie clearAccess = ResponseCookie.from(ACCESS_TOKEN_COOKIE, "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .build();
        response.addHeader("Set-Cookie", clearAccess.toString());

        ResponseCookie clearRefresh = ResponseCookie.from(REFRESH_TOKEN_COOKIE, "")
                .httpOnly(true)
                .path("/auth/refresh")
                .maxAge(0)
                .build();
        response.addHeader("Set-Cookie", clearRefresh.toString());
    }

    //Doc access token tu request
    public Optional<String> getAccessToken(HttpServletRequest request){
        return getCookieValue(request, ACCESS_TOKEN_COOKIE);
    }

    public Optional<String> getRefreshToken(HttpServletRequest request){
        return getCookieValue(request, REFRESH_TOKEN_COOKIE);
    }

    private Optional<String> getCookieValue(HttpServletRequest request, String name){
        if (request.getCookies() == null) return  Optional.empty();
        for (Cookie cookie : request.getCookies()){
            if (name.equals(cookie.getName())){
                return Optional.of(cookie.getValue());
            }
        }
        return Optional.empty();
    }
}