import { useEffect, useCallback, useRef } from 'react';
import { usePlayerState, usePlayerDispatch } from '../context/PlayerContext';
import { recordPlay } from '../api/plays';
import type { Track } from '../types';

/**
 * Singleton global Audio element — shared across all usePlayer() hook instances.
 *
 * WHY SINGLETON: If each component that calls usePlayer() created its own Audio
 * element, you'd get overlapping playback — two tracks playing simultaneously
 * when navigating between pages. A module-level singleton ensures one audio
 * output regardless of how many components use the hook.
 *
 * WHY MODULE-LEVEL (not ref/state): The Audio element must survive component
 * unmounts. If it lived in a ref, navigating away from a page would destroy
 * the ref and stop playback. Module-level variables persist for the app lifetime.
 */
const globalAudio = new Audio();
globalAudio.preload = 'metadata';

/**
 * Owner tracking — prevents duplicate event wiring.
 *
 * WHY: Multiple components may call usePlayer() simultaneously (PlayerBar + TrackList).
 * Without owner tracking, each would wire timeupdate/ended handlers, causing duplicate
 * dispatches (SET_TIME fired N times per tick). The Symbol ensures exactly one instance
 * owns the event wiring at any time.
 */
let audioOwnerRef: symbol | null = null;

// Expose the singleton for AudioContext connection in the visualizer (S03).
// The visualizer needs createMediaElementSource(globalAudio) — can only be called once.
export { globalAudio };

export function usePlayer() {
  const state = usePlayerState();
  const dispatch = usePlayerDispatch();
  const ownerSymbol = useRef(Symbol('player-owner'));
  const playReportedRef = useRef<number | null>(null); // trackId of last reported play
  const currentTrackRef = useRef<Track | null>(null);

  // Keep ref in sync with state for use in event handlers (avoids stale closures)
  useEffect(() => {
    currentTrackRef.current = state.currentTrack;
  }, [state.currentTrack]);

  // Wire audio events — only one usePlayer instance does this
  useEffect(() => {
    if (audioOwnerRef !== null) return;
    audioOwnerRef = ownerSymbol.current;

    const onTimeUpdate = () => {
      dispatch({ type: 'SET_TIME', time: globalAudio.currentTime });

      // Report play when user has listened past 50% of the track
      const track = currentTrackRef.current;
      if (
        globalAudio.duration > 0 &&
        globalAudio.currentTime > globalAudio.duration * 0.5 &&
        track &&
        playReportedRef.current !== track.id
      ) {
        const listenDuration = Math.round(globalAudio.currentTime);
        playReportedRef.current = track.id;
        recordPlay(track.id, listenDuration).catch((err) => {
          console.debug('[player] Failed to record play:', err.message);
        });
        console.debug('[player] Play recorded for track:', track.id);
      }
    };
    const onLoadedMetadata = () => {
      dispatch({ type: 'SET_DURATION', duration: globalAudio.duration });
    };
    const onEnded = () => {
      dispatch({ type: 'NEXT' });
    };

    globalAudio.addEventListener('timeupdate', onTimeUpdate);
    globalAudio.addEventListener('loadedmetadata', onLoadedMetadata);
    globalAudio.addEventListener('ended', onEnded);

    return () => {
      globalAudio.removeEventListener('timeupdate', onTimeUpdate);
      globalAudio.removeEventListener('loadedmetadata', onLoadedMetadata);
      globalAudio.removeEventListener('ended', onEnded);
      if (audioOwnerRef === ownerSymbol.current) {
        audioOwnerRef = null;
      }
    };
  }, [dispatch]);

  // Sync volume changes to the Audio element
  useEffect(() => {
    globalAudio.volume = state.volume;
  }, [state.volume]);

  // Load and play when currentTrack changes
  useEffect(() => {
    if (audioOwnerRef !== ownerSymbol.current) return;
    if (!state.currentTrack) return;

    // Reset play reporting for the new track
    playReportedRef.current = null;

    const src = `/api/stream/${state.currentTrack.id}`;
    const fullSrc = window.location.origin + src;

    if (globalAudio.src !== fullSrc) {
      console.debug('[player] Loading track:', state.currentTrack.title, '→', src);
      globalAudio.src = src;
      globalAudio.load();
    }

    if (state.isPlaying) {
      globalAudio.play().catch((err) => {
        console.error('[player] Playback error:', err.message);
      });
    }
  }, [state.currentTrack?.id]);

  // Sync play/pause state to the Audio element
  useEffect(() => {
    if (audioOwnerRef !== ownerSymbol.current) return;
    if (!state.currentTrack) return;

    if (state.isPlaying) {
      globalAudio.play().catch(() => {});
    } else {
      globalAudio.pause();
    }
  }, [state.isPlaying]);

  // Handle PREV/repeat-one: when reducer resets currentTime to 0, sync to Audio
  useEffect(() => {
    if (audioOwnerRef !== ownerSymbol.current) return;
    if (state.currentTime === 0 && globalAudio.currentTime > 0 && state.currentTrack) {
      globalAudio.currentTime = 0;
      if (state.isPlaying) {
        globalAudio.play().catch(() => {});
      }
    }
  }, [state.currentTime]);

  // --- Media Session API ---
  // Syncs track metadata and playback controls with the OS.
  // This enables: keyboard media keys, OS now-playing overlay (Windows/macOS),
  // lock screen controls on mobile, and Bluetooth headset buttons.

  // Sync metadata when track changes
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    if (!state.currentTrack) {
      navigator.mediaSession.metadata = null;
      navigator.mediaSession.playbackState = 'none';
      return;
    }

    const track = state.currentTrack;
    const artwork: MediaImage[] = [];

    // Cover art URL — needs absolute URL for Media Session
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

    console.debug('[mediaSession] Metadata set:', track.title, '—', track.artist?.name);
  }, [state.currentTrack?.id]);

  // Sync playback state
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.playbackState = state.currentTrack
      ? (state.isPlaying ? 'playing' : 'paused')
      : 'none';
  }, [state.isPlaying, state.currentTrack]);

  // Register action handlers (once)
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    if (audioOwnerRef !== ownerSymbol.current) return;

    const actions: Array<[MediaSessionAction, () => void]> = [
      ['play', () => dispatch({ type: 'RESUME' })],
      ['pause', () => dispatch({ type: 'PAUSE' })],
      ['nexttrack', () => dispatch({ type: 'NEXT' })],
      ['previoustrack', () => dispatch({ type: 'PREV' })],
    ];

    for (const [action, handler] of actions) {
      navigator.mediaSession.setActionHandler(action, handler);
    }

    // Seek handler — receives details with seekTime
    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (details.seekTime != null) {
        globalAudio.currentTime = details.seekTime;
        dispatch({ type: 'SET_TIME', time: details.seekTime });
      }
    });

    console.debug('[mediaSession] Action handlers registered');

    return () => {
      for (const [action] of actions) {
        navigator.mediaSession.setActionHandler(action, null);
      }
      navigator.mediaSession.setActionHandler('seekto', null);
    };
  }, [dispatch]);

  // Update position state for OS seek bar
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    if (!state.currentTrack || !state.duration) return;

    navigator.mediaSession.setPositionState({
      duration: state.duration,
      playbackRate: 1,
      position: Math.min(state.currentTime, state.duration),
    });
  }, [state.currentTime, state.duration, state.currentTrack]);

  const playTrack = useCallback(
    (track: Track, queue?: Track[], queueIndex?: number) => {
      dispatch({ type: 'PLAY_TRACK', track, queue, queueIndex });
    },
    [dispatch]
  );

  const playAlbum = useCallback(
    (tracks: Track[], startIndex = 0) => {
      if (tracks.length === 0) return;
      dispatch({
        type: 'PLAY_TRACK',
        track: tracks[startIndex],
        queue: tracks,
        queueIndex: startIndex,
      });
    },
    [dispatch]
  );

  const pause = useCallback(() => dispatch({ type: 'PAUSE' }), [dispatch]);
  const resume = useCallback(() => dispatch({ type: 'RESUME' }), [dispatch]);
  const next = useCallback(() => dispatch({ type: 'NEXT' }), [dispatch]);
  const prev = useCallback(() => dispatch({ type: 'PREV' }), [dispatch]);
  const toggleShuffle = useCallback(() => dispatch({ type: 'TOGGLE_SHUFFLE' }), [dispatch]);
  const toggleRepeat = useCallback(() => dispatch({ type: 'TOGGLE_REPEAT' }), [dispatch]);

  const seek = useCallback(
    (time: number) => {
      globalAudio.currentTime = time;
      dispatch({ type: 'SET_TIME', time });
    },
    [dispatch]
  );

  const setVolume = useCallback(
    (volume: number) => dispatch({ type: 'SET_VOLUME', volume }),
    [dispatch]
  );

  return {
    ...state,
    playTrack,
    playAlbum,
    pause,
    resume,
    next,
    prev,
    seek,
    setVolume,
    toggleShuffle,
    toggleRepeat,
  };
}
