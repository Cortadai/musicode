package com.musicode.model.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class WaveformResponse {
    private final Long trackId;
    private final float[] peaks;
}
