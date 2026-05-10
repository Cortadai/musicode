package com.musicode.controller;

import com.musicode.model.entity.Role;
import com.musicode.model.entity.User;
import com.musicode.repository.PlaybackEventRepository;
import com.musicode.repository.PlaylistRepository;
import com.musicode.repository.PlaylistTrackRepository;
import com.musicode.repository.RefreshTokenRepository;
import com.musicode.repository.UserRepository;
import com.musicode.service.JwtService;
import com.musicode.util.CookieUtil;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.*;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private UserRepository userRepository;
    @Autowired private PlaybackEventRepository playbackEventRepository;
    @Autowired private PlaylistTrackRepository playlistTrackRepository;
    @Autowired private PlaylistRepository playlistRepository;
    @Autowired private RefreshTokenRepository refreshTokenRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtService jwtService;

    @BeforeEach
    void setUp() {
        playbackEventRepository.deleteAll();
        refreshTokenRepository.deleteAll();
        playlistTrackRepository.deleteAll();
        playlistRepository.deleteAll();
        userRepository.deleteAll();

        userRepository.save(User.builder()
                .username("admin")
                .passwordHash(passwordEncoder.encode("admin123"))
                .role(Role.ADMIN)
                .build());

        userRepository.save(User.builder()
                .username("listener")
                .passwordHash(passwordEncoder.encode("listen123"))
                .role(Role.LISTENER)
                .build());
    }

    @Test
    void login_validCredentials_returns200WithCookies() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"admin\",\"password\":\"admin123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.username", is("admin")))
                .andExpect(jsonPath("$.user.role", is("ADMIN")))
                .andExpect(jsonPath("$.user.id").isNumber())
                .andExpect(jsonPath("$.accessTokenExpiresIn").isNumber())
                // Password should never appear
                .andExpect(jsonPath("$.user.password").doesNotExist())
                .andExpect(jsonPath("$.user.passwordHash").doesNotExist())
                .andReturn();

        // Verify cookies are set
        var cookies = result.getResponse().getCookies();
        assertThat(cookies).isNotEmpty();

        var accessCookie = findCookie(cookies, CookieUtil.ACCESS_TOKEN_COOKIE);
        assertThat(accessCookie).isNotNull();
        assertThat(accessCookie.isHttpOnly()).isTrue();
        assertThat(jwtService.isTokenValid(accessCookie.getValue())).isTrue();

        var refreshCookie = findCookie(cookies, CookieUtil.REFRESH_TOKEN_COOKIE);
        assertThat(refreshCookie).isNotNull();
        assertThat(refreshCookie.isHttpOnly()).isTrue();
    }

    @Test
    void login_invalidCredentials_returns401() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"admin\",\"password\":\"wrong\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error", is("Invalid credentials")));
    }

    @Test
    void login_blankUsername_returns400() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"\",\"password\":\"pass\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void protectedEndpoint_withoutToken_returns401() throws Exception {
        mockMvc.perform(get("/api/tracks"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void protectedEndpoint_withValidToken_returns200() throws Exception {
        // Login first
        var loginResult = performLogin("listener", "listen123");
        var accessCookie = findCookie(loginResult.getResponse().getCookies(), CookieUtil.ACCESS_TOKEN_COOKIE);

        // Use the token to access a protected endpoint
        mockMvc.perform(get("/api/albums")
                        .cookie(accessCookie))
                .andExpect(status().isOk());
    }

    @Test
    void refresh_withValidToken_rotatesTokens() throws Exception {
        // Login
        var loginResult = performLogin("admin", "admin123");
        var refreshCookie = findCookie(loginResult.getResponse().getCookies(), CookieUtil.REFRESH_TOKEN_COOKIE);

        // Refresh
        MvcResult refreshResult = mockMvc.perform(post("/api/auth/refresh")
                        .cookie(refreshCookie))
                .andExpect(status().isOk())
                .andReturn();

        // Should get new cookies
        var newAccessCookie = findCookie(refreshResult.getResponse().getCookies(), CookieUtil.ACCESS_TOKEN_COOKIE);
        var newRefreshCookie = findCookie(refreshResult.getResponse().getCookies(), CookieUtil.REFRESH_TOKEN_COOKIE);
        assertThat(newAccessCookie).isNotNull();
        assertThat(newRefreshCookie).isNotNull();

        // Old refresh token should be revoked — using it again should fail
        mockMvc.perform(post("/api/auth/refresh")
                        .cookie(refreshCookie))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void refresh_withoutToken_returns401() throws Exception {
        mockMvc.perform(post("/api/auth/refresh"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void logout_clearsTokens() throws Exception {
        // Login
        var loginResult = performLogin("admin", "admin123");
        var accessCookie = findCookie(loginResult.getResponse().getCookies(), CookieUtil.ACCESS_TOKEN_COOKIE);
        var refreshCookie = findCookie(loginResult.getResponse().getCookies(), CookieUtil.REFRESH_TOKEN_COOKIE);

        // Logout
        MvcResult logoutResult = mockMvc.perform(post("/api/auth/logout")
                        .cookie(accessCookie, refreshCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("Logged out")))
                .andReturn();

        // Cookies should be cleared (maxAge=0)
        var clearedAccess = findCookie(logoutResult.getResponse().getCookies(), CookieUtil.ACCESS_TOKEN_COOKIE);
        assertThat(clearedAccess).isNotNull();
        assertThat(clearedAccess.getMaxAge()).isEqualTo(0);

        // Refresh token should be revoked — using it should fail
        mockMvc.perform(post("/api/auth/refresh")
                        .cookie(refreshCookie))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void me_withValidToken_returnsUserInfo() throws Exception {
        var loginResult = performLogin("listener", "listen123");
        var accessCookie = findCookie(loginResult.getResponse().getCookies(), CookieUtil.ACCESS_TOKEN_COOKIE);

        mockMvc.perform(get("/api/auth/me")
                        .cookie(accessCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username", is("listener")))
                .andExpect(jsonPath("$.role", is("LISTENER")));
    }

    @Test
    void me_withoutToken_returns401() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());
    }

    // --- helpers ---

    private MvcResult performLogin(String username, String password) throws Exception {
        return mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"" + username + "\",\"password\":\"" + password + "\"}"))
                .andExpect(status().isOk())
                .andReturn();
    }

    private Cookie findCookie(Cookie[] cookies, String name) {
        if (cookies == null) return null;
        for (Cookie c : cookies) {
            if (name.equals(c.getName())) return c;
        }
        return null;
    }
}
