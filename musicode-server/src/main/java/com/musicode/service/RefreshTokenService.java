package com.musicode.service;

import com.musicode.model.entity.RefreshToken;
import com.musicode.model.entity.User;
import com.musicode.repository.RefreshTokenRepository;
import com.musicode.util.TokenHashUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

/**
 * Manages refresh token lifecycle: creation, validation, rotation, and revocation.
 *
 * REFRESH TOKEN DESIGN:
 *
 * 1. OPAQUE TOKENS — Refresh tokens are random UUIDs, not JWTs. The backend must
 *    look them up in the database to validate. This means we can revoke them instantly
 *    (unlike JWTs which are valid until expiry). The cost is one DB query per refresh.
 *
 * 2. HASHED STORAGE — Only the SHA-256 hash of the token is stored in the database.
 *    If the DB is compromised, the attacker has hashes — they can't reverse them to
 *    get valid tokens. Same principle as password hashing, but without salt (tokens
 *    are already high-entropy UUIDs, so rainbow tables don't help).
 *
 * 3. TOKEN ROTATION — Every time a refresh token is used, the old one is revoked and
 *    a new one is issued. This limits the window of a stolen token — the attacker
 *    gets at most one use. If the legitimate user refreshes first, the stolen token
 *    becomes invalid.
 *
 * 4. THEFT DETECTION — If a revoked token is presented (someone tries to reuse an
 *    already-rotated token), ALL tokens for that user are revoked. This catches the
 *    case where an attacker stole a token and used it — the legitimate user's next
 *    refresh will fail, alerting them to re-login. Better than silently letting the
 *    attacker maintain access.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;

    @Transactional
    public String createToken(User user) {
        var rawToken = UUID.randomUUID().toString();
        var hash = TokenHashUtil.hash(rawToken);

        var token = RefreshToken.builder()
                .user(user)
                .tokenHash(hash)
                .expiresAt(Instant.now().plusMillis(jwtService.getRefreshTokenExpirationMs()))
                .build();

        refreshTokenRepository.save(token);
        return rawToken;
    }

    @Transactional
    public String validateAndRotate(String rawToken, User user) {
        var hash = TokenHashUtil.hash(rawToken);
        var tokenOpt = refreshTokenRepository.findByTokenHash(hash);

        if (tokenOpt.isEmpty()) {
            log.warn("Refresh token not found");
            return null;
        }

        var token = tokenOpt.get();

        if (token.isRevoked()) {
            // THEFT DETECTION: someone is reusing a token that was already rotated.
            // Revoke everything for this user — force re-login on all devices.
            log.warn("Reuse of revoked refresh token detected for user '{}' — revoking all tokens",
                    token.getUser().getUsername());
            revokeAllForUser(token.getUser());
            return null;
        }

        if (token.isExpired()) {
            log.warn("Expired refresh token for user '{}'", token.getUser().getUsername());
            token.setRevoked(true);
            refreshTokenRepository.save(token);
            return null;
        }

        // Rotation: revoke old, issue new
        token.setRevoked(true);
        refreshTokenRepository.save(token);

        return createToken(user);
    }

    @Transactional
    public void revokeByRawToken(String rawToken) {
        var hash = TokenHashUtil.hash(rawToken);
        refreshTokenRepository.findByTokenHash(hash).ifPresent(token -> {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
        });
    }

    @Transactional
    public void revokeAllForUser(User user) {
        var count = refreshTokenRepository.revokeAllByUser(user);
        log.info("Revoked {} refresh tokens for user '{}'", count, user.getUsername());
    }

    /** Hourly cleanup of expired tokens to prevent table growth. */
    @Scheduled(fixedRate = 3600000)
    @Transactional
    public void cleanupExpired() {
        var deleted = refreshTokenRepository.deleteAllExpiredBefore(Instant.now());
        if (deleted > 0) {
            log.info("Cleaned up {} expired refresh tokens", deleted);
        }
    }
}
