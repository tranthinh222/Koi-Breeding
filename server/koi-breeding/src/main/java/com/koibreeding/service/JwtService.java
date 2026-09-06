package com.koibreeding.service;

import com.koibreeding.domain.User;
import com.koibreeding.repository.UserRepository;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class JwtService {

    @Value("${jwt.signKey}")
    private String signKey;
    @Value("${jwt.expiration}")
    private long accessExpiration;
    @Value("${jwt.refresh}")
    private long refreshExpiration;

    private SecretKey getSigningKey(){
        return Keys.hmacShaKeyFor(signKey.getBytes(StandardCharsets.UTF_8));
    }

    private String generateToken(User user, long expiration, String type){
        Date now = new Date();
        Date expiry = new Date((now.getTime() + expiration));

        return Jwts.builder()
                .subject(user.getUsername())
                .claim("type", type)
                .claim("role", user.getRole())
                .issuedAt(now)
                .expiration(expiry)
                .signWith(getSigningKey())
                .compact();
    }

    public String generateAccessToken(User user){
        return generateToken(user, accessExpiration, "access");
    }

    public String generateRefreshToken(User user){
        return generateToken(user, refreshExpiration, "refresh");
    }

    //verify Token
    public String verifyToken(String token){
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return String.valueOf(claims.getSubject());
    }

    // Kiem tra token (con han va hop le)
    public boolean isAccessTokenValid(String token){
        try{
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String tokenType = claims.get("type", String.class);
            return  "access".equals(tokenType) && claims.getExpiration().after(new Date());
        }catch (Exception e){
            return false;
        }
    }

    public boolean isRefreshTokenValid(String token){
        try{
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String tokenType = claims.get("type", String.class);
            return "refresh".equals(tokenType) && claims.getExpiration().after(new Date());
        }catch (Exception e){
            return false;
        }
    }
}