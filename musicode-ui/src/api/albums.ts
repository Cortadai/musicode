import api from './client';
import type { Page, Album } from '../types';

export async function getAlbums(page = 0, size = 30) {
  const { data } = await api.get<Page<Album>>('/albums', { params: { page, size } });
  return data;
}

export async function getAlbum(id: number) {
  const { data } = await api.get<Album>(`/albums/${id}`);
  return data;
}

export function getCoverUrl(albumId: number) {
  return `/api/covers/${albumId}`;
}
