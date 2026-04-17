package com.musicode.config;

import com.musicode.service.TokenEncryptionService;
import com.musicode.util.EncryptedStringConverter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * One-shot migration that re-encrypts plaintext scrobble credentials on startup.
 *
 * Rationale: the schema pre-S03 stored Last.fm session keys and ListenBrainz tokens in the
 * clear. The converter installed in S03 reads those legacy values transparently (tolerant
 * read), but any update path would leave other rows unchanged. This runner scans the
 * columns once at boot, encrypts anything that does not already carry the "v1:" prefix,
 * and writes the ciphertext back via raw JDBC so dirty-checking short-circuits are moot.
 *
 * Idempotent by construction — a second boot finds only "v1:"-prefixed rows and exits
 * without writing. Logs row counts only; token material is never logged.
 *
 * Runs after Flyway because Spring's ApplicationRunners fire once the context is fully
 * initialized.
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class TokenMigrationRunner implements ApplicationRunner {

    private static final List<String> TOKEN_COLUMNS = List.of("lastfm_session_key", "listenbrainz_token");

    private final JdbcTemplate jdbcTemplate;
    private final TokenEncryptionService encryptionService;

    @Override
    public void run(ApplicationArguments args) {
        int migrated = 0;
        for (String column : TOKEN_COLUMNS) {
            migrated += encryptLegacyRows(column);
        }
        if (migrated > 0) {
            log.info("Token encryption migration: re-encrypted {} plaintext scrobble credential(s) at rest", migrated);
        } else {
            log.debug("Token encryption migration: no plaintext rows found");
        }
    }

    /**
     * Column name is a hardcoded constant from TOKEN_COLUMNS — safe to concatenate.
     */
    private int encryptLegacyRows(String column) {
        String selectSql = "SELECT id, " + column + " AS token FROM users "
            + "WHERE " + column + " IS NOT NULL AND " + column + " NOT LIKE ?";
        List<Map<String, Object>> rows = jdbcTemplate.queryForList(selectSql, EncryptedStringConverter.PREFIX + "%");

        if (rows.isEmpty()) {
            return 0;
        }

        String updateSql = "UPDATE users SET " + column + " = ? WHERE id = ?";
        for (Map<String, Object> row : rows) {
            Long userId = ((Number) row.get("id")).longValue();
            String plaintext = (String) row.get("token");
            String encrypted = EncryptedStringConverter.PREFIX + encryptionService.encrypt(plaintext);
            jdbcTemplate.update(updateSql, encrypted, userId);
        }
        return rows.size();
    }
}
