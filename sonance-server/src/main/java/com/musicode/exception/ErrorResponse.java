package com.musicode.exception;

import java.time.Instant;

/**
 * Consistent error response format returned by GlobalExceptionHandler.
 * Frontend parses the 'error' field for display.
 */
public record ErrorResponse(
        int status,
        String error,
        String path,
        Instant timestamp
) {
    public static ErrorResponse of(int status, String error, String path) {
        return new ErrorResponse(status, error, path, Instant.now());
    }
}
