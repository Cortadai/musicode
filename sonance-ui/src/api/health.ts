import api from './client';
import type { Page } from '../types';

export type HealthIssueType =
  | 'MISSING_ARTIST'
  | 'MISSING_ALBUM'
  | 'MISSING_TITLE'
  | 'MISSING_TRACK_NUMBER'
  | 'MISSING_YEAR'
  | 'MISSING_GENRE'
  | 'MISSING_COVER_ART';

export interface HealthSummary {
  totalTracks: number;
  totalAlbums: number;
  totalIssues: number;
  issueCounts: Partial<Record<HealthIssueType, number>>;
}

export interface HealthIssue {
  type: HealthIssueType;
  entityId: number;
  entityName: string;
  detail: string;
  filePath: string;
}

export const ISSUE_LABELS: Record<HealthIssueType, string> = {
  MISSING_ARTIST: 'Missing artist',
  MISSING_ALBUM: 'Missing album',
  MISSING_TITLE: 'Title matches filename',
  MISSING_TRACK_NUMBER: 'Missing track number',
  MISSING_YEAR: 'Missing year',
  MISSING_GENRE: 'Missing genre',
  MISSING_COVER_ART: 'Missing cover art',
};

export const ISSUE_SEVERITY: Record<HealthIssueType, 'high' | 'medium' | 'low'> = {
  MISSING_ARTIST: 'high',
  MISSING_ALBUM: 'medium',
  MISSING_TITLE: 'high',
  MISSING_TRACK_NUMBER: 'medium',
  MISSING_YEAR: 'low',
  MISSING_GENRE: 'low',
  MISSING_COVER_ART: 'medium',
};

export async function getHealthSummary() {
  const { data } = await api.get<HealthSummary>('/library/health/summary');
  return data;
}

export async function getHealthIssues(type: HealthIssueType, page = 0, size = 50) {
  const { data } = await api.get<Page<HealthIssue>>('/library/health/issues', {
    params: { type, page, size },
  });
  return data;
}
