import api from './client';
import type { VideoFolder } from '../types';

export async function getVideoFolders() {
  const { data } = await api.get<VideoFolder[]>('/videos/folders');
  return data;
}

export async function addVideoFolder(path: string) {
  const { data } = await api.post<VideoFolder>('/videos/folders', { path });
  return data;
}

export async function removeVideoFolder(id: number) {
  await api.delete(`/videos/folders/${id}`);
}

export async function listVideos() {
  const { data } = await api.get<string[]>('/videos');
  return data;
}
