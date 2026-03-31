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
            log.warn("Attempted use of revoked refresh token for user: {}", token.getUser().getUsername());
            revokeAllForUser(token.getUser());
            return null;
        }

        if (token.isExpired()) {
            log.warn("Expired refresh token for user: {}", token.getUser().getUsername());
            token.setRevoked(true);
            refreshTokenRepository.save(token);
            return null;
        }

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
        log.info("Revoked {} refresh tokens for user: {}", count, user.getUsername());
    }

    @Scheduled(fixedRate = 3600000)
    @Transactional
    public void cleanupExpired() {
        var deleted = refreshTokenRepository.deleteAllExpiredBefore(Instant.now());
        if (deleted > 0) {
            log.info("Cleaned up {} expired refresh tokens", deleted);
        }
    }
}
