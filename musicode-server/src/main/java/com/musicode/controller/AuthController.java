package com.musicode.controller;

import com.musicode.model.dto.LoginRequest;
import com.musicode.model.dto.UserResponse;
import com.musicode.repository.UserRepository;
import com.musicode.service.AuthService;
import com.musicode.service.JwtService;
import com.musicode.util.CookieUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Authentication", description = "Login, logout, token refresh, and session info")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final CookieUtil cookieUtil;
    private final UserRepository userRepository;

    /**
     * Login stays as try-catch because we need to set cookies on success.
     * @ControllerAdvice would handle the AuthenticationException, but we lose the
     * ability to set Set-Cookie headers on the success path in a clean way.
     * The trade-off: one try-catch in login vs forcing cookie logic into the advice.
     */
    @PostMapping("/login")
    @Operation(summary = "Login", description = "Authenticate with username and password. Sets HttpOnly access_token and refresh_token cookies on success.")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            var tokenPair = authService.login(request.username(), request.password());
            var user = userRepository.findByUsername(request.username()).orElseThrow();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookieUtil.createAccessTokenCookie(tokenPair.accessToken()).toString())
                    .header(HttpHeaders.SET_COOKIE, cookieUtil.createRefreshTokenCookie(tokenPair.refreshToken()).toString())
                    .body(Map.of(
                            "user", UserResponse.from(user),
                            "accessTokenExpiresIn", jwtService.getAccessTokenExpirationMs()
                    ));
        } catch (AuthenticationException e) {
            log.warn("Login failed for user '{}': {}", request.username(), e.getMessage());
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh tokens", description = "Rotate access and refresh tokens using the refresh_token cookie. Old refresh token is revoked.")
    public ResponseEntity<?> refresh(HttpServletRequest request) {
        var refreshToken = CookieUtil.extractCookie(request.getCookies(), CookieUtil.REFRESH_TOKEN_COOKIE);

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

        var username = jwtService.extractUsername(tokenPair.accessToken());
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("User not found after refresh: " + username));

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookieUtil.createAccessTokenCookie(tokenPair.accessToken()).toString())
                .header(HttpHeaders.SET_COOKIE, cookieUtil.createRefreshTokenCookie(tokenPair.refreshToken()).toString())
                .body(Map.of(
                        "user", UserResponse.from(user),
                        "accessTokenExpiresIn", jwtService.getAccessTokenExpirationMs()
                ));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout", description = "Revoke refresh token and clear auth cookies.")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        var refreshToken = CookieUtil.extractCookie(request.getCookies(), CookieUtil.REFRESH_TOKEN_COOKIE);

        if (refreshToken != null && !refreshToken.isBlank()) {
            authService.logout(refreshToken);
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookieUtil.clearAccessTokenCookie().toString())
                .header(HttpHeaders.SET_COOKIE, cookieUtil.clearRefreshTokenCookie().toString())
                .body(Map.of("message", "Logged out"));
    }

    @GetMapping("/me")
    @Operation(summary = "Current user", description = "Returns the currently authenticated user's info.")
    public ResponseEntity<?> me(@AuthenticationPrincipal String username) {
        if (username == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        return userRepository.findByUsername(username)
                .map(u -> ResponseEntity.ok((Object) UserResponse.from(u)))
                .orElse(ResponseEntity.status(401).body(Map.of("error", "User not found")));
    }
}
