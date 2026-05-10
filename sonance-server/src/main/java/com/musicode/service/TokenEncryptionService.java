package com.musicode.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.encrypt.Encryptors;
import org.springframework.security.crypto.encrypt.TextEncryptor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

/**
 * Encrypts scrobble credentials at rest using AES-256-GCM with PBKDF2 key derivation
 * (Spring Security's Encryptors.delux — the text-returning variant of the "stronger"
 * BytesEncryptor family).
 *
 * Key comes from SONANCE_TOKEN_ENCRYPTION_KEY. Missing key fails fast at startup; the
 * test profile provides a fixed key via application-test.yml.
 *
 * Salt is a fixed application constant. Security depends on key secrecy and the random
 * per-encryption IV that the stronger encryptor generates, not on salt secrecy.
 */
@Service
public class TokenEncryptionService {

    private static final String SALT = "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6";

    private final TextEncryptor encryptor;

    public TokenEncryptionService(@Value("${sonance.encryption.token-key:}") String key) {
        if (!StringUtils.hasText(key)) {
            throw new IllegalStateException(
                "SONANCE_TOKEN_ENCRYPTION_KEY is required. Generate with 'openssl rand -hex 32' and set before starting.");
        }
        this.encryptor = Encryptors.delux(key, SALT);
    }

    public String encrypt(String plaintext) {
        return plaintext == null ? null : encryptor.encrypt(plaintext);
    }

    public String decrypt(String ciphertext) {
        return ciphertext == null ? null : encryptor.decrypt(ciphertext);
    }
}
