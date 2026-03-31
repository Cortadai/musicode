package com.musicode.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Thrown when request data is invalid beyond what Bean Validation catches
 * (e.g. folder path doesn't exist, scan already in progress).
 * Mapped to HTTP 400 by GlobalExceptionHandler.
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}
