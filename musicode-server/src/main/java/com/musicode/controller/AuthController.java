package com.musicode.controller;

import com.musicode.model.dto.LoginRequest;
import com.musicode.model.dto.UserResponse;
import com.musicode.repository.UserRepository;
import com.musicode.service.AuthService;
import com.musicode.service.JwtService;
import com.musicode.util.CookieUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final CookieUtil cookieUtil;
    private final UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            var tokenPair = authService.login(request.getUsername(), request.getPassword());
            var user = userRepository.findByUsername(request.getUsername()).orElseThrow();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookieUtil.createAccessTokenCookie(tokenPair.getAccessToken()).toString())
                    .header(HttpHeaders.SET_COOKIE, cookieUtil.createRefreshTokenCookie(tokenPair.getRefreshToken()).toString())
                    .body(UserResponse.from(user));
        } catch (AuthenticationException e) {
            log.warn("Login failed for user '{}': {}", request.getUsername(), e.getMessage());
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest request) {
        String refreshToken = CookieUtil.extractCookie(request.getCookies(), CookieUtil.REFRESH_TOKEN_COOKIE);

        if (refreshToken == null || refreshToken.isBlank()) {
            return ResponseEntity.status(401).body(Map.of("error", "Refresh token missing"));
        }

        var tokenPair = authService.refresh(refreshToken);
        if (tokenPair == null) {
            return ResponseEntity.status(401)
                    .header(HttpHeaders.SET_COOKIE, cookieUtil.clearAccessTokenCookie().toString())
                    .header(HttpHeaders.SET_COOKIE, cookieUtil.clearRefreshTokenCookie().toString())
                    .body(Map.of("error", "Invalid or expired refresh token"));
        }

        // Extract username from new access token to return user info
        String username = jwtService.extractUsername(tokenPair.getAccessToken());
        var user = userRepository.findByUsername(username);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookieUtil.createAccessTokenCookie(tokenPair.getAccessToken()).toString())
                .header(HttpHeaders.SET_COOKIE, cookieUtil.createRefreshTokenCookie(tokenPair.getRefreshToken()).toString())
                .body(user.map(UserResponse::from).orElse(null));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        String refreshToken = CookieUtil.extractCookie(request.getCookies(), CookieUtil.REFRESH_TOKEN_COOKIE);

        if (refreshToken != null && !refreshToken.isBlank()) {
            authService.logout(refreshToken);
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookieUtil.clearAccessTokenCookie().toString())
                .header(HttpHeaders.SET_COOKIE, cookieUtil.clearRefreshTokenCookie().toString())
                .body(Map.of("message", "Logged out"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@AuthenticationPrincipal String username) {
        if (username == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        return userRepository.findByUsername(username)
                .map(u -> ResponseEntity.ok((Object) UserResponse.from(u)))
                .orElse(ResponseEntity.status(401).body(Map.of("error", "User not found")));
    }
}
