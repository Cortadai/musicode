import api from './client';

export interface TopArtistStat {
  name: string;
  playCount: number;
}

export interface TopAlbumStat {
  title: string;
  albumId: number;
  artistName: string;
  playCount: number;
}

export interface TopTrackStat {
  title: string;
  trackId: number;
  artistName: string;
  playCount: number;
}

export interface StatsSummary {
  totalPlays: number;
  totalListeningSec: number;
  uniqueArtists: number;
  uniqueAlbums: number;
}

export interface DailyPlayCount {
  date: string;
  count: number;
}

export type Period = 'week' | 'month' | 'year' | 'all';

export async function getTopArtists(period: Period = 'month', limit = 10) {
  const { data } = await api.get<TopArtistStat[]>('/stats/top-artists', { params: { period, limit } });
  return data;
}

export async function getTopAlbums(period: Period = 'month', limit = 10) {
  const { data } = await api.get<TopAlbumStat[]>('/stats/top-albums', { params: { period, limit } });
  return data;
}

export async function getTopTracks(period: Period = 'month', limit = 10) {
  const { data } = await api.get<TopTrackStat[]>('/stats/top-tracks', { params: { period, limit } });
  return data;
}

export async function getSummary(period: Period = 'month') {
  const { data } = await api.get<StatsSummary>('/stats/summary', { params: { period } });
  return data;
}

export async function getHistory(period: Period = 'month') {
  const { data } = await api.get<DailyPlayCount[]>('/stats/history', { params: { period } });
  return data;
}
