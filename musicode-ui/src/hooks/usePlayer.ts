import { useEffect, useCallback, useRef } from 'react';
import { usePlayerState, usePlayerDispatch } from '../context/PlayerContext';
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

export function usePlayer() {
  const state = usePlayerState();
  const dispatch = usePlayerDispatch();
  const ownerSymbol = useRef(Symbol('player-owner'));

  // Wire audio events — only one usePlayer instance does this
  useEffect(() => {
    if (audioOwnerRef !== null) return;
    audioOwnerRef = ownerSymbol.current;

    const onTimeUpdate = () => {
      dispatch({ type: 'SET_TIME', time: globalAudio.currentTime });
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
