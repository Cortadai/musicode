package com.musicode.model.dto;

public enum HealthIssueType {
    MISSING_ARTIST("Track without artist"),
    MISSING_ALBUM("Track without album"),
    MISSING_TITLE("Track title matches filename"),
    MISSING_TRACK_NUMBER("Track without track number"),
    MISSING_YEAR("Track without year"),
    MISSING_GENRE("Track without genre"),
    MISSING_COVER_ART("Album without cover art");

    private final String label;

    HealthIssueType(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
