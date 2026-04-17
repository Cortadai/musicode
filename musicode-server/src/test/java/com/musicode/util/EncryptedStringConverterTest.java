package com.musicode.util;

import com.musicode.service.TokenEncryptionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class EncryptedStringConverterTest {

    private EncryptedStringConverter converter;

    @BeforeEach
    void setUp() {
        TokenEncryptionService service = new TokenEncryptionService(
            "converter-test-key-0123456789abcdef");
        EncryptedStringConverter.setEncryptionService(service);
        converter = new EncryptedStringConverter();
    }

    @Test
    void writeWrapsCiphertextWithV1PrefixAndObscuresPlaintext() {
        String db = converter.convertToDatabaseColumn("lastfm-session-token");

        assertNotNull(db);
        assertTrue(db.startsWith(EncryptedStringConverter.PREFIX));
        assertFalse(db.contains("lastfm-session-token"));
    }

    @Test
    void writeThenReadRoundTripYieldsOriginalPlaintext() {
        String plaintext = "lastfm-session-token";

        String db = converter.convertToDatabaseColumn(plaintext);

        assertEquals(plaintext, converter.convertToEntityAttribute(db));
    }

    @Test
    void legacyPlaintextValuesAreReturnedAsIsOnRead() {
        // Rows written before encryption was introduced have no "v1:" prefix.
        // The converter must pass them through unchanged so TokenMigrationRunner
        // can rewrite them through JPA on startup.
        assertEquals("legacy-token-no-prefix",
            converter.convertToEntityAttribute("legacy-token-no-prefix"));
    }

    @Test
    void nullPassesThroughBothDirections() {
        assertNull(converter.convertToDatabaseColumn(null));
        assertNull(converter.convertToEntityAttribute(null));
    }

    @Test
    void prefixedButMalformedCiphertextFailsAtDecrypt() {
        assertThrows(Exception.class,
            () -> converter.convertToEntityAttribute(EncryptedStringConverter.PREFIX + "not-real-ciphertext"));
    }

    @Test
    void usingConverterWithoutInitializerFailsFast() {
        EncryptedStringConverter.setEncryptionService(null);
        EncryptedStringConverter fresh = new EncryptedStringConverter();

        IllegalStateException ex = assertThrows(IllegalStateException.class,
            () -> fresh.convertToDatabaseColumn("anything"));
        assertTrue(ex.getMessage().contains("TokenEncryptionService"));
    }
}
