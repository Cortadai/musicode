import api from './client';

export interface ScrobbleSettings {
  listenbrainzConnected: boolean;
  lastfmConnected: boolean;
  listenbrainzTokenMasked: string | null;
  lastfmSessionKeyMasked: string | null;
}

export async function getScrobbleSettings() {
  const { data } = await api.get<ScrobbleSettings>('/scrobble/settings');
  return data;
}

export async function updateScrobbleSettings(body: {
  listenbrainzToken?: string;
  lastfmUsername?: string;
  lastfmPassword?: string;
}) {
  const { data } = await api.put<ScrobbleSettings>('/scrobble/settings', body);
  return data;
}

export async function disconnectLastfm() {
  const { data } = await api.delete<ScrobbleSettings>('/scrobble/settings/lastfm');
  return data;
}

export async function disconnectListenBrainz() {
  const { data } = await api.delete<ScrobbleSettings>('/scrobble/settings/listenbrainz');
  return data;
}
