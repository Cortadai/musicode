import api from './client';
import type { Page, Track } from '../types';

export async function getTracks(page = 0, size = 50, sort = 'trackNumber,asc') {
  const { data } = await api.get<Page<Track>>('/tracks', { params: { page, size, sort } });
  return data;
}

export async function getTrack(id: number) {
  const { data } = await api.get<Track>(`/tracks/${id}`);
  return data;
}
