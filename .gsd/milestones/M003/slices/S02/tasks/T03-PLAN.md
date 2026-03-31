---
estimated_steps: 1
estimated_files: 4
skills_used: []
---

# T03: JwtAuthFilter + SecurityFilterChain + CookieUtil

Create CookieUtil: createAccessTokenCookie(String token), createRefreshTokenCookie(String token), clearAccessTokenCookie(), clearRefreshTokenCookie(). Access cookie: HttpOnly, SameSite=Strict, path=/. Refresh cookie: HttpOnly, SameSite=Strict, path=/api/auth/refresh. Secure flag from config (musicode.cookies.secure, default false for dev). Create JwtAuthFilter extends OncePerRequestFilter: reads access_token cookie, validates with JwtService, sets SecurityContextHolder. Skip filter for /api/auth/** paths. Replace SecurityConfig filterChain: stateless session, disable CSRF, permit /api/auth/login, require auth for everything else, add JwtAuthFilter before UsernamePasswordAuthenticationFilter. Configure CORS in SecurityConfig via CorsConfigurationSource (replace WebConfig CORS — Spring Security CORS takes precedence). AuthenticationManager bean via AuthenticationConfiguration.

## Inputs

- `JwtService from T01`
- `MusicodeUserDetailsService from S01`
- `SecurityConfig from S01`

## Expected Output

- `CookieUtil.java`
- `JwtAuthFilter.java`
- `Updated SecurityConfig.java`

## Verification

mvn compile — compiles cleanly
