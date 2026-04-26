import api from './client';
import type { LibraryFolder, ScanStatus } from '../types';

export async function getFolders() {
  const { data } = await api.get<LibraryFolder[]>('/library/folders');
  return data;
}

export async function addFolder(path: string) {
  const { data } = await api.post<LibraryFolder>('/library/folders', { path });
  return data;
}

export async function removeFolder(id: number) {
  await api.delete(`/library/folders/${id}`);
}

export async function startScan() {
  const { data } = await api.post('/library/scan');
  return data;
}

export async function getScanStatus() {
  const { data } = await api.get<ScanStatus>('/library/scan/status');
  return data;
}

export async function resetLibrary() {
  const { data } = await api.delete('/library/reset');
  return data;
}
