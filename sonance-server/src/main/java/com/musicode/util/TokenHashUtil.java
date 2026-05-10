package com.musicode.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

/**
 * Token hashing utility. SHA-256 ensures raw refresh tokens are never stored in the database —
 * only the hash is persisted. If the DB is compromised, the attacker can't use the hashes
 * to forge valid refresh tokens.
 */
public final class TokenHashUtil {

    private TokenHashUtil() {}

    public static String hash(String rawToken) {
        try {
            var digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }
}
