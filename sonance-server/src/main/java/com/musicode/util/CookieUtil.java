package com.musicode.util;

import jakarta.servlet.http.Cookie;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

/**
 * Creates and clears authentication cookies with security flags.
 *
 * COOKIE SECURITY FLAGS:
 *
 * - HttpOnly: JavaScript cannot read these cookies (document.cookie won't see them).
 *   This prevents XSS attacks from stealing auth tokens. The browser sends them
 *   automatically — the frontend never touches tokens directly.
 *
 * - SameSite=Strict: The browser only sends these cookies on same-origin requests.
 *   A malicious site can't trigger a POST to our API and have the browser include
 *   our auth cookies. This is our primary CSRF protection (see D015).
 *
 * - Secure: Only sent over HTTPS. In dev (http://localhost), Chrome treats localhost
 *   as a secure context so it works. The flag is profile-aware: false in dev, true
 *   in Docker/production. Without this flag in prod, cookies would travel in plaintext.
 *
 * - Path restriction on refresh cookie: The refresh token cookie is scoped to
 *   /api/auth/refresh — the browser only sends it to that one endpoint. This limits
 *   exposure: even if another endpoint has a vulnerability, the refresh token isn't
 *   sent there.
 */
@Component
public class CookieUtil {

    public static final String ACCESS_TOKEN_COOKIE = "access_token";
    public static final String REFRESH_TOKEN_COOKIE = "refresh_token";
    private static final String REFRESH_TOKEN_PATH = "/api/auth/refresh";

    @Value("${sonance.cookies.secure:false}")
    private boolean secureCookie;

    @Value("${sonance.jwt.access-token-expiration-ms:900000}")
    private long accessTokenExpirationMs;

    @Value("${sonance.jwt.refresh-token-expiration-ms:604800000}")
    private long refreshTokenExpirationMs;

    public ResponseCookie createAccessTokenCookie(String token) {
        return ResponseCookie.from(ACCESS_TOKEN_COOKIE, token)
                .httpOnly(true)
                .secure(secureCookie)
                .sameSite("Strict")
                .path("/")
                .maxAge(accessTokenExpirationMs / 1000)
                .build();
    }

    public ResponseCookie createRefreshTokenCookie(String token) {
        return ResponseCookie.from(REFRESH_TOKEN_COOKIE, token)
                .httpOnly(true)
                .secure(secureCookie)
                .sameSite("Strict")
                .path(REFRESH_TOKEN_PATH)
                .maxAge(refreshTokenExpirationMs / 1000)
                .build();
    }

    public ResponseCookie clearAccessTokenCookie() {
        return ResponseCookie.from(ACCESS_TOKEN_COOKIE, "")
                .httpOnly(true)
                .secure(secureCookie)
                .sameSite("Strict")
                .path("/")
                .maxAge(0)
                .build();
    }

    public ResponseCookie clearRefreshTokenCookie() {
        return ResponseCookie.from(REFRESH_TOKEN_COOKIE, "")
                .httpOnly(true)
                .secure(secureCookie)
                .sameSite("Strict")
                .path(REFRESH_TOKEN_PATH)
                .maxAge(0)
                .build();
    }

    public static String extractCookie(Cookie[] cookies, String name) {
        if (cookies == null) return null;
        for (var cookie : cookies) {
            if (name.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }
}
