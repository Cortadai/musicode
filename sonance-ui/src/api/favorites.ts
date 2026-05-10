import api from './client';
import type { Track } from '../types';

export interface FavoriteToggleResult {
  trackId: number;
  favorited: boolean;
}

export interface FavoritesPage {
  content: (Track & { favoritedAt: string })[];
  totalElements: number;
  totalPages: number;
  page: number;
}

export async function toggleFavorite(trackId: number): Promise<FavoriteToggleResult> {
  const { data } = await api.put<FavoriteToggleResult>(`/favorites/${trackId}`);
  return data;
}

export async function getFavorites(page = 0, size = 50): Promise<FavoritesPage> {
  const { data } = await api.get<FavoritesPage>('/favorites', { params: { page, size } });
  return data;
}

export async function getFavoriteIds(): Promise<Set<number>> {
  const { data } = await api.get<number[]>('/favorites/ids');
  return new Set(data);
}

export async function getFavoriteCount(): Promise<number> {
  const { data } = await api.get<{ count: number }>('/favorites/count');
  return data.count;
}
