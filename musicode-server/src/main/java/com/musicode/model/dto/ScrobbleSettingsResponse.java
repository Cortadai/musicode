package com.musicode.model.dto;

public record ScrobbleSettingsResponse(
        boolean listenbrainzConnected,
        boolean lastfmConnected,
        String listenbrainzTokenMasked,
        String lastfmSessionKeyMasked
) {
    /**
     * Mask a token for display: show first 4 and last 4 chars.
     */
    public static String mask(String token) {
        if (token == null || token.length() <= 8) return token != null ? "****" : null;
        return token.substring(0, 4) + "…" + token.substring(token.length() - 4);
    }

    public static ScrobbleSettingsResponse from(com.musicode.model.entity.User user) {
        return new ScrobbleSettingsResponse(
                user.getListenbrainzToken() != null && !user.getListenbrainzToken().isBlank(),
                user.getLastfmSessionKey() != null && !user.getLastfmSessionKey().isBlank(),
                mask(user.getListenbrainzToken()),
                mask(user.getLastfmSessionKey())
        );
    }
}
