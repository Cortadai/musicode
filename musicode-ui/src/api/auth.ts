import api from './client';
import type { UserInfo, LoginCredentials } from '../types';

export async function login(credentials: LoginCredentials): Promise<UserInfo> {
  const { data } = await api.post<UserInfo>('/auth/login', credentials);
  return data;
}

export async function refresh(): Promise<UserInfo> {
  const { data } = await api.post<UserInfo>('/auth/refresh');
  return data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

export async function getMe(): Promise<UserInfo> {
  const { data } = await api.get<UserInfo>('/auth/me');
  return data;
}
