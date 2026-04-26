package com.musicode.config;

import com.musicode.filter.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Central security configuration for Musicode.
 *
 * ARCHITECTURE DECISIONS:
 *
 * 1. STATELESS SESSIONS — No server-side session. Each request carries its own
 *    auth via JWT in a cookie. This simplifies horizontal scaling (no session
 *    replication) and aligns with REST principles.
 *
 * 2. CSRF DISABLED (D015) — We rely on SameSite=Strict cookies instead. The browser
 *    won't send our auth cookies on cross-origin requests, which is the primary CSRF
 *    vector. If we ever relax to SameSite=Lax (for direct-link support), we'd need
 *    to enable CookieCsrfTokenRepository.
 *
 * 3. FILTER ORDER — JwtAuthFilter runs BEFORE UsernamePasswordAuthenticationFilter.
 *    This means every request first checks for a JWT cookie. If valid, SecurityContext
 *    is set and the request proceeds as authenticated. If absent/invalid, the request
 *    continues unauthenticated — and the authorization rules below decide the response.
 *
 * 4. ENTRY POINT + ACCESS DENIED — These handlers catch rejections that happen BEFORE
 *    reaching a controller (e.g. missing token → 401, wrong role → 403). They return
 *    JSON instead of Spring's default HTML error pages. The @ControllerAdvice handles
 *    exceptions thrown FROM controllers. Both are needed.
 *
 * 5. CORS WITH CREDENTIALS — Required because the frontend (localhost:5173 in dev)
 *    is a different origin from the backend (localhost:8080). allowCredentials=true
 *    tells the browser it's OK to send cookies cross-origin. In production behind
 *    Caddy, everything is same-origin so CORS doesn't apply.
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public: login and refresh don't require an existing token
                .requestMatchers("/api/auth/login").permitAll()
                .requestMatchers("/api/auth/refresh").permitAll()
                // Cover art — loaded via <img> tags, no sensitive data
                .requestMatchers("/api/covers/**").permitAll()
                // Actuator health — used by Docker healthcheck
                .requestMatchers("/actuator/health").permitAll()
                // Swagger UI and OpenAPI spec
                .requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**", "/v3/api-docs.yaml").permitAll()
                // Admin-only: library mutations and user management
                .requestMatchers("/api/users/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/library/folders").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/library/folders/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/library/scan").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/library/cleanup").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/library/reset").hasRole("ADMIN")
                // Everything else: any authenticated user (ADMIN or LISTENER)
                .anyRequest().authenticated()
            )
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(401);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\":\"Authentication required\"}");
                })
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.setStatus(403);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\":\"Access denied\"}");
                })
            )
            .headers(headers -> headers
                .frameOptions(frame -> frame.deny())
                .contentTypeOptions(cto -> {})
                .httpStrictTransportSecurity(hsts -> hsts
                    .includeSubDomains(true)
                    .maxAgeInSeconds(31536000)))
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * CORS configuration for dev mode (frontend on :5173, backend on :8080).
     * In production behind Caddy, all traffic is same-origin — CORS is a no-op.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        var config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("Content-Range", "Accept-Ranges", "Content-Length"));
        config.setAllowCredentials(true);

        var source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }
}
