package com.musicode.model.dto;

public record HealthIssue(
        HealthIssueType type,
        Long entityId,
        String entityName,
        String detail,
        String filePath
) {}
