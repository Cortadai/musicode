package com.musicode.filter;

import com.musicode.service.JwtService;
import com.musicode.util.CookieUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * JWT authentication filter — reads the access token from an HttpOnly cookie,
 * validates it, and sets the Spring SecurityContext for the request.
 *
 * WHY COOKIES, NOT AUTHORIZATION HEADER:
 * - HttpOnly cookies can't be read by JavaScript → immune to XSS token theft.
 * - The browser sends them automatically → no client-side token management.
 * - SameSite=Strict prevents cross-origin requests from including the cookie → CSRF mitigation.
 * - Trade-off: we can't use the token from non-browser clients (e.g. curl) without
 *   manually setting a Cookie header. For Subsonic API (future), we'd add a separate
 *   auth mechanism.
 *
 * WHY EXTRACT ROLE FROM TOKEN:
 * We embed the role in the JWT claim instead of loading the User from the database
 * on every request. This avoids a DB query per request. The trade-off: if an admin
 * changes a user's role, the old role stays in the JWT until it expires (15 min max).
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    /**
     * Skip the filter for login — no token exists yet, and the login endpoint
     * is marked permitAll() in SecurityConfig.
     */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return request.getServletPath().startsWith("/api/auth/login");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        var token = CookieUtil.extractCookie(request.getCookies(), CookieUtil.ACCESS_TOKEN_COOKIE);

        if (token != null && jwtService.isTokenValid(token)) {
            var username = jwtService.extractUsername(token);
            var role = jwtService.extractRole(token);

            // Build an authentication token with the role from the JWT.
            // The "credentials" param is null — we already validated the JWT,
            // so there's no password to carry around.
            var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role));
            var authToken = new UsernamePasswordAuthenticationToken(username, null, authorities);
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            SecurityContextHolder.getContext().setAuthentication(authToken);
        }

        filterChain.doFilter(request, response);
    }
}
