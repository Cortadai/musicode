import { useEffect, useCallback, useRef } from 'react';
import { usePlayerState, usePlayerDispatch } from '../context/PlayerContext';
import type { Track } from '../types';

// Single global Audio element — shared across all usePlayer() calls
const globalAudio = new Audio();
globalAudio.preload = 'metadata';

// Track which component instance owns the audio event wiring
let audioOwnerRef: symbol | null = null;

export function usePlayer() {
  const state = usePlayerState();
  const dispatch = usePlayerDispatch();
  const ownerSymbol = useRef(Symbol('player-owner'));

  // Only one usePlayer instance wires audio events (the first to mount — PlayerBar)
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

  // Sync volume — safe to run from any instance
  useEffect(() => {
    globalAudio.volume = state.volume;
  }, [state.volume]);

  // Load and play when currentTrack changes — only from the owner
  useEffect(() => {
    if (audioOwnerRef !== ownerSymbol.current) return;
    if (!state.currentTrack) return;

    const src = `/api/stream/${state.currentTrack.id}`;
    const fullSrc = window.location.origin + src;

    if (globalAudio.src !== fullSrc) {
      globalAudio.src = src;
      globalAudio.load();
    }

    if (state.isPlaying) {
      globalAudio.play().catch((err) => {
        console.error('Playback error:', err);
      });
    }
  }, [state.currentTrack?.id]);

  // Sync play/pause — only from the owner
  useEffect(() => {
    if (audioOwnerRef !== ownerSymbol.current) return;
    if (!state.currentTrack) return;

    if (state.isPlaying) {
      globalAudio.play().catch(() => {});
    } else {
      globalAudio.pause();
    }
  }, [state.isPlaying]);

  // Handle PREV restarting current track — only from the owner
  useEffect(() => {
    if (audioOwnerRef !== ownerSymbol.current) return;
    if (state.currentTime === 0 && globalAudio.currentTime > 0 && state.currentTrack) {
      globalAudio.currentTime = 0;
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
  };
}
