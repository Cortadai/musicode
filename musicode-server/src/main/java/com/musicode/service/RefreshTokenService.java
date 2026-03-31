package com.musicode.service;

import com.musicode.model.entity.RefreshToken;
import com.musicode.model.entity.User;
import com.musicode.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.Base64;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;

    /**
     * Creates a new refresh token for the user.
     * Returns the raw token (to set in cookie). Only the hash is persisted.
     */
    @Transactional
    public String createToken(User user) {
        String rawToken = UUID.randomUUID().toString();
        String hash = hashToken(rawToken);

        var token = RefreshToken.builder()
                .user(user)
                .tokenHash(hash)
                .expiresAt(Instant.now().plusMillis(jwtService.getRefreshTokenExpirationMs()))
                .build();

        refreshTokenRepository.save(token);
        return rawToken;
    }

    /**
     * Validates a raw refresh token: finds by hash, checks expiry/revoked.
     * If valid, revokes the old token and creates a new one (rotation).
     * Returns the new raw token, or null if invalid.
     */
    @Transactional
    public String validateAndRotate(String rawToken, User user) {
        String hash = hashToken(rawToken);
        var tokenOpt = refreshTokenRepository.findByTokenHash(hash);

        if (tokenOpt.isEmpty()) {
            log.warn("Refresh token not found");
            return null;
        }

        var token = tokenOpt.get();

        if (token.isRevoked()) {
            log.warn("Attempted use of revoked refresh token for user: {}", token.getUser().getUsername());
            // Potential token theft — revoke all tokens for this user
            revokeAllForUser(token.getUser());
            return null;
        }

        if (token.isExpired()) {
            log.warn("Expired refresh token for user: {}", token.getUser().getUsername());
            token.setRevoked(true);
            refreshTokenRepository.save(token);
            return null;
        }

        // Revoke old token
        token.setRevoked(true);
        refreshTokenRepository.save(token);

        // Issue new token
        return createToken(user);
    }

    @Transactional
    public void revokeByRawToken(String rawToken) {
        String hash = hashToken(rawToken);
        refreshTokenRepository.findByTokenHash(hash).ifPresent(token -> {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
        });
    }

    @Transactional
    public void revokeAllForUser(User user) {
        int count = refreshTokenRepository.revokeAllByUser(user);
        log.info("Revoked {} refresh tokens for user: {}", count, user.getUsername());
    }

    @Scheduled(fixedRate = 3600000) // every hour
    @Transactional
    public void cleanupExpired() {
        int deleted = refreshTokenRepository.deleteAllExpiredBefore(Instant.now());
        if (deleted > 0) {
            log.info("Cleaned up {} expired refresh tokens", deleted);
        }
    }

    private String hashToken(String rawToken) {
        try {
            var digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }
}
