import api from './client';
import type { SearchResults } from '../types';

export async function search(query: string) {
  const { data } = await api.get<SearchResults>('/search', { params: { q: query } });
  return data;
}
