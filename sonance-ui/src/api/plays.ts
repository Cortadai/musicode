import api from './client';

/**
 * Record a play event for a track.
 * Called when playback passes 50% of the track's duration.
 */
export async function recordPlay(trackId: number, listenDurationSec?: number, config?: { signal?: AbortSignal }) {
  await api.post(`/plays/${trackId}`, listenDurationSec != null ? { listenDurationSec } : {}, config);
}
