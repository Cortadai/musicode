package com.musicode.model.dto;

public record ArtistBioDTO(String summary, String fullBio, String lastfmUrl) {

    public static ArtistBioDTO empty() {
        return new ArtistBioDTO(null, null, null);
    }

    public boolean isEmpty() {
        return summary == null || summary.isBlank();
    }
}
