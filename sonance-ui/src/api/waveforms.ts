import api from './client';

export interface WaveformResponse {
  trackId: number;
  peaks: number[];
}

export async function getWaveform(trackId: number) {
  const { data } = await api.get<WaveformResponse>(`/waveforms/${trackId}`, {
    timeout: 120_000,
  });
  return data;
}
