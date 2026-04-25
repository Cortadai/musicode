package com.musicode.model.dto;

import java.util.Map;

public record HealthSummary(
        long totalTracks,
        long totalAlbums,
        long totalIssues,
        Map<HealthIssueType, Long> issueCounts
) {}
