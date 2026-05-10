import api from './client';
import type { Track } from '../types';

export interface PlaylistSummary {
  id: number;
  name: string;
  trackCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlaylistTrackEntry extends Track {
  position: number;
  addedAt: string;
}

export interface PlaylistDetail extends PlaylistSummary {
  tracks: PlaylistTrackEntry[];
}

export async function getPlaylists(): Promise<PlaylistSummary[]> {
  const { data } = await api.get<PlaylistSummary[]>('/playlists');
  return data;
}

export async function getPlaylist(id: number): Promise<PlaylistDetail> {
  const { data } = await api.get<PlaylistDetail>(`/playlists/${id}`);
  return data;
}

export async function createPlaylist(name: string): Promise<PlaylistSummary> {
  const { data } = await api.post<PlaylistSummary>('/playlists', { name });
  return data;
}

export async function renamePlaylist(id: number, name: string): Promise<PlaylistSummary> {
  const { data } = await api.put<PlaylistSummary>(`/playlists/${id}`, { name });
  return data;
}

export async function deletePlaylist(id: number): Promise<void> {
  await api.delete(`/playlists/${id}`);
}

export async function addTracksToPlaylist(id: number, trackIds: number[]): Promise<{ added: number }> {
  const { data } = await api.post<{ added: number }>(`/playlists/${id}/tracks`, { trackIds });
  return data;
}

export async function removeTracksFromPlaylist(id: number, trackIds: number[]): Promise<void> {
  await api.delete(`/playlists/${id}/tracks`, { data: { trackIds } });
}

export async function reorderPlaylistTracks(id: number, trackIds: number[]): Promise<void> {
  await api.put(`/playlists/${id}/tracks/reorder`, { trackIds });
}
