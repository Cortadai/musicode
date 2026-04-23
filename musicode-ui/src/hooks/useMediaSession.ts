import { useEffect } from 'react';
import type { Track } from '../types';

interface UseMediaSessionParams {
  track: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isOwner: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (time: number) => void;
}

export function useMediaSession({
  track,
  isPlaying,
  currentTime,
  duration,
  isOwner,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onSeek,
}: UseMediaSessionParams) {
  // Sync metadata when track changes
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    if (!track) {
      navigator.mediaSession.metadata = null;
      navigator.mediaSession.playbackState = 'none';
      return;
    }

    const artwork: MediaImage[] = [];
    if (track.album?.hasCoverArt && track.album.id) {
      const coverUrl = `${window.location.origin}/api/covers/${track.album.id}`;
      artwork.push({ src: coverUrl, sizes: '512x512', type: 'image/jpeg' });
    }

    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist?.name ?? 'Unknown Artist',
      album: track.album?.title ?? 'Unknown Album',
      artwork,
    });
  }, [track?.id]);

  // Sync playback state
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.playbackState = track
      ? (isPlaying ? 'playing' : 'paused')
      : 'none';
  }, [isPlaying, track]);

  // Register action handlers (once, owner only)
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    if (!isOwner) return;

    const actions: Array<[MediaSessionAction, () => void]> = [
      ['play', onPlay],
      ['pause', onPause],
      ['nexttrack', onNext],
      ['previoustrack', onPrev],
    ];

    for (const [action, handler] of actions) {
      navigator.mediaSession.setActionHandler(action, handler);
    }

    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (details.seekTime != null) {
        onSeek(details.seekTime);
      }
    });

    return () => {
      for (const [action] of actions) {
        navigator.mediaSession.setActionHandler(action, null);
      }
      navigator.mediaSession.setActionHandler('seekto', null);
    };
  }, [isOwner, onPlay, onPause, onNext, onPrev, onSeek]);

  // Update position state for OS seek bar
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    if (!track || !duration) return;

    navigator.mediaSession.setPositionState({
      duration,
      playbackRate: 1,
      position: Math.min(currentTime, duration),
    });
  }, [currentTime, duration, track]);
}
