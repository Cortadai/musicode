import api from './client';
import type { Page, Artist } from '../types';

export async function getArtists(page = 0, size = 30) {
  const { data } = await api.get<Page<Artist>>('/artists', { params: { page, size } });
  return data;
}

export async function getArtist(id: number) {
  const { data } = await api.get<Artist>(`/artists/${id}`);
  return data;
}
