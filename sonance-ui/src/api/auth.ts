import api from './client';
import type { UserInfo, LoginCredentials } from '../types';

export interface AuthResponse {
  user: UserInfo;
  accessTokenExpiresIn: number;
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', credentials);
  return data;
}

export async function refresh(): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/refresh');
  return data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

export async function getMe(config?: { signal?: AbortSignal }): Promise<UserInfo> {
  const { data } = await api.get<UserInfo>('/auth/me', config);
  return data;
}
