package com.musicode.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedDeque;

/**
 * Sliding-window rate limiter for the login endpoint.
 *
 * 5 attempts per IP per 60-second window. Returns 429 when exceeded.
 * In-memory only — resets on server restart. No external dependencies.
 *
 * Runs after RequestIdFilter but before the security chain so that
 * blocked requests never reach authentication logic.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 1)
@Slf4j
public class LoginRateLimitFilter extends OncePerRequestFilter {

    private final int maxAttempts;
    private final long windowSeconds;

    public LoginRateLimitFilter(
            @org.springframework.beans.factory.annotation.Value("${musicode.security.login-rate-limit.max-attempts:5}") int maxAttempts,
            @org.springframework.beans.factory.annotation.Value("${musicode.security.login-rate-limit.window-seconds:60}") long windowSeconds) {
        this.maxAttempts = maxAttempts;
        this.windowSeconds = windowSeconds;
    }

    private final ConcurrentHashMap<String, ConcurrentLinkedDeque<Instant>> attempts = new ConcurrentHashMap<>();

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !("/api/auth/login".equals(request.getServletPath())
                && HttpMethod.POST.matches(request.getMethod()));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String ip = resolveClientIp(request);
        Instant now = Instant.now();
        Instant windowStart = now.minusSeconds(windowSeconds);

        ConcurrentLinkedDeque<Instant> timestamps = attempts.computeIfAbsent(ip, k -> new ConcurrentLinkedDeque<>());

        // Evict entries outside the window
        while (!timestamps.isEmpty() && timestamps.peekFirst().isBefore(windowStart)) {
            timestamps.pollFirst();
        }

        if (timestamps.size() >= maxAttempts) {
            log.warn("Rate limit exceeded for login from IP {}", ip);
            response.setStatus(429);
            response.setContentType("application/json");
            response.setHeader("Retry-After", String.valueOf(windowSeconds));
            response.getWriter().write("{\"error\":\"Too many login attempts. Try again later.\"}");
            return;
        }

        timestamps.addLast(now);
        filterChain.doFilter(request, response);
    }

    private String resolveClientIp(HttpServletRequest request) {
        // Behind Caddy/reverse proxy, the real IP is in X-Forwarded-For
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            // Take the first IP (client), not intermediary proxies
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
