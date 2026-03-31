import api from './client';

export interface ActivityEvent {
  username: string;
  trackTitle: string;
  artistName: string;
  albumTitle: string;
  albumId: number | null;
  hasCoverArt: boolean;
  timestamp: string;
}

export async function getRecentActivity() {
  const { data } = await api.get<ActivityEvent[]>('/activity/recent');
  return data;
}
