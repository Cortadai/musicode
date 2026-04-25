package com.musicode.controller;

import com.musicode.model.dto.WaveformResponse;
import com.musicode.service.WaveformService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class WaveformControllerTest {

    @Autowired private MockMvc mockMvc;
    @MockitoBean private WaveformService waveformService;

    @Test
    @WithMockUser(username = "testuser")
    void getWaveform_returnsWaveformData() throws Exception {
        float[] peaks = {0.1f, 0.5f, 1.0f, 0.3f};
        when(waveformService.getWaveform(1L)).thenReturn(Optional.of(peaks));

        mockMvc.perform(get("/api/waveforms/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.trackId").value(1))
                .andExpect(jsonPath("$.peaks").isArray())
                .andExpect(jsonPath("$.peaks[2]").value(1.0));
    }

    @Test
    @WithMockUser(username = "testuser")
    void getWaveform_notFound_returns404() throws Exception {
        when(waveformService.getWaveform(999L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/waveforms/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void getWaveform_unauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/waveforms/1"))
                .andExpect(status().isUnauthorized());
    }
}
