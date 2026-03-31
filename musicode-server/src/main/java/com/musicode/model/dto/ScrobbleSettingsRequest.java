package com.musicode.model.dto;

public record ScrobbleSettingsRequest(
        String listenbrainzToken,
        String lastfmUsername,
        String lastfmPassword
) {}
