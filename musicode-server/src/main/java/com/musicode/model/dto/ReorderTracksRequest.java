package com.musicode.model.dto;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record ReorderTracksRequest(
        @NotEmpty List<Long> trackIds
) {}
