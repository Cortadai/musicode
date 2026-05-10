package com.musicode.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Thrown when a create/update would violate a uniqueness constraint (e.g. duplicate username).
 * Mapped to HTTP 409 by GlobalExceptionHandler.
 */
@ResponseStatus(HttpStatus.CONFLICT)
public class ConflictException extends RuntimeException {
    public ConflictException(String message) {
        super(message);
    }
}
