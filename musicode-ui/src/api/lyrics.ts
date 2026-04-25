import api from './client';

export type LyricsStatus = 'NOT_SEARCHED' | 'SYNCED' | 'PLAIN_ONLY' | 'INSTRUMENTAL' | 'NOT_FOUND';

export interface LyricsResponse {
  trackId: number;
  status: LyricsStatus;
  syncedLyrics: string | null;
  plainLyrics: string | null;
}

export async function getLyrics(trackId: number) {
  const { data } = await api.get<LyricsResponse>(`/lyrics/${trackId}`);
  return data;
}

export async function retryLyrics(trackId: number) {
  const { data } = await api.post<LyricsResponse>(`/lyrics/${trackId}/retry`);
  return data;
}
