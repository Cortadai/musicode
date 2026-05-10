package com.musicode.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class TokenEncryptionServiceTest {

    private static final String KEY = "c1234567890abcdef0123456789abcdef";

    private TokenEncryptionService service() {
        return new TokenEncryptionService(KEY);
    }

    @Test
    void roundTripReturnsOriginalPlaintext() {
        TokenEncryptionService s = service();
        String ciphertext = s.encrypt("super-secret-token");

        assertNotEquals("super-secret-token", ciphertext);
        assertEquals("super-secret-token", s.decrypt(ciphertext));
    }

    @Test
    void encryptProducesDifferentCiphertextEachCallForSamePlaintext() {
        // Encryptors.stronger uses a random IV, so the same input must not produce
        // the same output — guards against accidentally using a deterministic encryptor.
        TokenEncryptionService s = service();

        assertNotEquals(s.encrypt("same-input"), s.encrypt("same-input"));
    }

    @Test
    void encryptAndDecryptReturnNullForNullInput() {
        TokenEncryptionService s = service();

        assertNull(s.encrypt(null));
        assertNull(s.decrypt(null));
    }

    @Test
    void emptyKeyFailsFastWithClearMessage() {
        IllegalStateException ex = assertThrows(IllegalStateException.class,
            () -> new TokenEncryptionService(""));

        assertTrue(ex.getMessage().contains("SONANCE_TOKEN_ENCRYPTION_KEY"));
    }

    @Test
    void nullKeyFailsFast() {
        assertThrows(IllegalStateException.class, () -> new TokenEncryptionService(null));
    }

    @Test
    void decryptingCiphertextWithWrongKeyThrows() {
        String ciphertext = service().encrypt("top-secret");
        TokenEncryptionService other = new TokenEncryptionService("different-key-0123456789abcdefabcd");

        assertThrows(Exception.class, () -> other.decrypt(ciphertext));
    }
}
