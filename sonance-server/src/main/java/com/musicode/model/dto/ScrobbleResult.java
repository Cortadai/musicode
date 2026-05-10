package com.musicode.model.dto;

public record ScrobbleResult(boolean success, ErrorType errorType, String message) {

    public enum ErrorType {
        NONE,
        AUTH_ERROR,
        CONFIG_ERROR,
        TIMEOUT,
        SERVER_ERROR,
        UNKNOWN
    }

    public static ScrobbleResult ok() {
        return new ScrobbleResult(true, ErrorType.NONE, null);
    }

    public static ScrobbleResult error(ErrorType type, String message) {
        return new ScrobbleResult(false, type, message);
    }

    public boolean isRetryable() {
        return errorType == ErrorType.TIMEOUT || errorType == ErrorType.SERVER_ERROR;
    }
}
