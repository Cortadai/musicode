package com.musicode.service;

import com.musicode.model.dto.TokenPair;
import com.musicode.model.entity.User;
import com.musicode.repository.RefreshTokenRepository;
import com.musicode.repository.UserRepository;
import com.musicode.util.TokenHashUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    /**
     * Authenticates the user and generates access + refresh tokens.
     * @return TokenPair with JWT access token and opaque refresh token
     * @throws AuthenticationException if credentials are invalid
     */
    @Transactional
    public TokenPair login(String username, String password) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password));

        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("User authenticated but not found: " + username));

        log.info("User '{}' logged in", username);

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = refreshTokenService.createToken(user);

        return new TokenPair(accessToken, refreshToken);
    }

    /**
     * Refreshes the access token using a valid refresh token.
     * The old refresh token is revoked and a new one is issued (rotation).
     * @return new TokenPair, or null if refresh token is invalid
     */
    @Transactional
    public TokenPair refresh(String rawRefreshToken) {
        var user = findUserByRefreshToken(rawRefreshToken);
        if (user == null) return null;

        String newRefreshToken = refreshTokenService.validateAndRotate(rawRefreshToken, user);
        if (newRefreshToken == null) return null;

        String accessToken = jwtService.generateAccessToken(user);
        return new TokenPair(accessToken, newRefreshToken);
    }

    /**
     * Revokes the refresh token (logout).
     */
    @Transactional
    public void logout(String rawRefreshToken) {
        refreshTokenService.revokeByRawToken(rawRefreshToken);
    }

    private User findUserByRefreshToken(String rawRefreshToken) {
        var hash = TokenHashUtil.hash(rawRefreshToken);
        return refreshTokenRepository.findByTokenHash(hash)
                .map(rt -> rt.getUser())
                .orElse(null);
    }
}
