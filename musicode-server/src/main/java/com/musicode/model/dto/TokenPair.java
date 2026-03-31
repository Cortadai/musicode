package com.musicode.model.dto;

public record TokenPair(
        String accessToken,
        String refreshToken
) {}
