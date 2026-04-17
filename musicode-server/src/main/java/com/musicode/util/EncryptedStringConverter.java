package com.musicode.util;

import com.musicode.service.TokenEncryptionService;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * JPA AttributeConverter that transparently encrypts String columns at rest.
 *
 * Write path: plaintext → "v1:" + ciphertext.
 * Read path: values with the "v1:" prefix are decrypted; anything else is returned as-is
 * (tolerant read for pre-migration plaintext rows — the TokenMigrationRunner re-encrypts
 * them on startup).
 *
 * The converter is instantiated by Hibernate outside the Spring context, so the
 * TokenEncryptionService is pushed in via a static field by the Initializer bean during
 * startup.
 */
@Converter
public class EncryptedStringConverter implements AttributeConverter<String, String> {

    public static final String PREFIX = "v1:";

    private static volatile TokenEncryptionService encryptionService;

    static void setEncryptionService(TokenEncryptionService service) {
        EncryptedStringConverter.encryptionService = service;
    }

    @Override
    public String convertToDatabaseColumn(String attribute) {
        if (attribute == null) {
            return null;
        }
        return PREFIX + requireService().encrypt(attribute);
    }

    @Override
    public String convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        if (!dbData.startsWith(PREFIX)) {
            return dbData;
        }
        return requireService().decrypt(dbData.substring(PREFIX.length()));
    }

    private static TokenEncryptionService requireService() {
        TokenEncryptionService svc = encryptionService;
        if (svc == null) {
            throw new IllegalStateException(
                "EncryptedStringConverter used before TokenEncryptionService was initialized");
        }
        return svc;
    }

    /**
     * Wires the Spring-managed TokenEncryptionService into the JPA-instantiated converter.
     * Runs once at startup; the static reference is then visible to every converter instance.
     */
    @Component
    @RequiredArgsConstructor
    static class Initializer {
        private final TokenEncryptionService service;

        @PostConstruct
        void init() {
            EncryptedStringConverter.setEncryptionService(service);
        }
    }
}
