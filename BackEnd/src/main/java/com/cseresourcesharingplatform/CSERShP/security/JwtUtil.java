package com.cseresourcesharingplatform.CSERShP.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    private final String SECRET_KEY = "supersecretkeysupersecretkey123456"; // keep safe, at least 32 chars
    private final long EXPIRATION_TIME = 1000 * 60 * 60 * 5; // 5 hours

    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    // Generate JWT
    public String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role) // add role claim
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Extract username
    public String extractUsername(String token) {
        return parseClaims(token).getSubject();
    }

    // Extract role
    public String extractRole(String token) {
        return parseClaims(token).get("role", String.class);
    }

    // Validate token
    public boolean validateToken(String token, String username) {
        return (username.equals(extractUsername(token)) && !isTokenExpired(token));
    }

    private Claims parseClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
    }

    private boolean isTokenExpired(String token) {
        return parseClaims(token).getExpiration().before(new Date());
    }
}
