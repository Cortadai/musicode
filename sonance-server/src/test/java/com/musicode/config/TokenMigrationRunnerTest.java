package com.musicode.config;

import com.musicode.model.entity.Role;
import com.musicode.model.entity.User;
import com.musicode.repository.PlaybackEventRepository;
import com.musicode.repository.PlaylistRepository;
import com.musicode.repository.PlaylistTrackRepository;
import com.musicode.repository.RefreshTokenRepository;
import com.musicode.repository.UserRepository;
import com.musicode.service.TokenEncryptionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class TokenMigrationRunnerTest {

    @Autowired private TokenMigrationRunner runner;
    @Autowired private JdbcTemplate jdbcTemplate;
    @Autowired private UserRepository userRepository;
    @Autowired private PlaybackEventRepository playbackEventRepository;
    @Autowired private PlaylistTrackRepository playlistTrackRepository;
    @Autowired private PlaylistRepository playlistRepository;
    @Autowired private RefreshTokenRepository refreshTokenRepository;
    @Autowired private TokenEncryptionService encryptionService;

    @BeforeEach
    void cleanDatabase() {
        playbackEventRepository.deleteAll();
        refreshTokenRepository.deleteAll();
        playlistTrackRepository.deleteAll();
        playlistRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void rewritesPlaintextRowsWithV1PrefixAndLeavesEncryptedRowsUntouched() {
        Long legacyId = insertUserRaw("legacy-user", "plain-lfm-key", "plain-lb-token");
        String preEncrypted = "v1:" + encryptionService.encrypt("already-safe");
        Long safeId = insertUserRaw("already-encrypted", preEncrypted, null);

        runner.run(null);

        Map<String, Object> legacyRow = readRawTokens(legacyId);
        assertThat((String) legacyRow.get("lastfm_session_key")).startsWith("v1:");
        assertThat((String) legacyRow.get("listenbrainz_token")).startsWith("v1:");

        User reloadedLegacy = userRepository.findById(legacyId).orElseThrow();
        assertThat(reloadedLegacy.getLastfmSessionKey()).isEqualTo("plain-lfm-key");
        assertThat(reloadedLegacy.getListenbrainzToken()).isEqualTo("plain-lb-token");

        Map<String, Object> safeRow = readRawTokens(safeId);
        assertThat((String) safeRow.get("lastfm_session_key")).isEqualTo(preEncrypted);

        User reloadedSafe = userRepository.findById(safeId).orElseThrow();
        assertThat(reloadedSafe.getLastfmSessionKey()).isEqualTo("already-safe");
    }

    @Test
    void secondRunIsIdempotentAndMakesNoFurtherChanges() {
        Long id = insertUserRaw("legacy-user", "plain-lfm-key", "plain-lb-token");

        runner.run(null);
        Map<String, Object> afterFirst = readRawTokens(id);
        runner.run(null);
        Map<String, Object> afterSecond = readRawTokens(id);

        assertThat(afterSecond.get("lastfm_session_key")).isEqualTo(afterFirst.get("lastfm_session_key"));
        assertThat(afterSecond.get("listenbrainz_token")).isEqualTo(afterFirst.get("listenbrainz_token"));
    }

    @Test
    void skipsRowsWithNullTokens() {
        Long id = insertUserRaw("no-tokens", null, null);

        runner.run(null);

        Map<String, Object> row = readRawTokens(id);
        assertThat(row.get("lastfm_session_key")).isNull();
        assertThat(row.get("listenbrainz_token")).isNull();
    }

    private Long insertUserRaw(String username, String lastfmSessionKey, String listenbrainzToken) {
        jdbcTemplate.update(
            "INSERT INTO users (username, password_hash, role, enabled, created_at, lastfm_session_key, listenbrainz_token) "
                + "VALUES (?, ?, ?, ?, ?, ?, ?)",
            username, "$2a$10$dummyhash", Role.LISTENER.name(), true, LocalDateTime.now(),
            lastfmSessionKey, listenbrainzToken
        );
        return jdbcTemplate.queryForObject(
            "SELECT id FROM users WHERE username = ?", Long.class, username);
    }

    private Map<String, Object> readRawTokens(Long userId) {
        return jdbcTemplate.queryForMap(
            "SELECT lastfm_session_key, listenbrainz_token FROM users WHERE id = ?", userId);
    }
}
