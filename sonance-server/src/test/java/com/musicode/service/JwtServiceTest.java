package com.musicode.service;

import com.musicode.model.entity.Role;
import com.musicode.model.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class JwtServiceTest {

    @Autowired
    private JwtService jwtService;

    private User testUser() {
        return User.builder()
                .id(1L)
                .username("testuser")
                .passwordHash("hashed")
                .role(Role.LISTENER)
                .build();
    }

    @Test
    void generateAccessToken_validToken() {
        String token = jwtService.generateAccessToken(testUser());
        assertThat(token).isNotBlank();
        assertThat(jwtService.isTokenValid(token)).isTrue();
    }

    @Test
    void extractUsername_fromAccessToken() {
        String token = jwtService.generateAccessToken(testUser());
        assertThat(jwtService.extractUsername(token)).isEqualTo("testuser");
    }

    @Test
    void extractRole_fromAccessToken() {
        String token = jwtService.generateAccessToken(testUser());
        assertThat(jwtService.extractRole(token)).isEqualTo("LISTENER");
    }

    @Test
    void extractRole_admin() {
        var admin = User.builder().id(2L).username("admin").passwordHash("h").role(Role.ADMIN).build();
        String token = jwtService.generateAccessToken(admin);
        assertThat(jwtService.extractRole(token)).isEqualTo("ADMIN");
    }

    @Test
    void isTokenValid_invalidToken_returnsFalse() {
        assertThat(jwtService.isTokenValid("not.a.token")).isFalse();
    }

    @Test
    void isTokenValid_emptyToken_returnsFalse() {
        assertThat(jwtService.isTokenValid("")).isFalse();
    }

    @Test
    void isTokenValid_nullToken_returnsFalse() {
        assertThat(jwtService.isTokenValid(null)).isFalse();
    }

    @Test
    void getExpiration_returnsNonNull() {
        String token = jwtService.generateAccessToken(testUser());
        assertThat(jwtService.getExpiration(token)).isNotNull();
        assertThat(jwtService.getExpiration(token)).isAfter(java.time.Instant.now());
    }

    @Test
    void generateRefreshJwt_validToken() {
        String token = jwtService.generateRefreshJwt(testUser());
        assertThat(token).isNotBlank();
        assertThat(jwtService.isTokenValid(token)).isTrue();
        assertThat(jwtService.extractUsername(token)).isEqualTo("testuser");
    }
}
