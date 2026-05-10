package com.musicode.model.dto;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record AddTracksRequest(
        @NotEmpty List<Long> trackIds
) {}
