import { useRef, useEffect, useCallback } from 'react';
import { usePlayerState, usePlayerDispatch } from '../context/PlayerContext';
import type { Track } from '../types';

export function usePlayer() {
  const state = usePlayerState();
  const dispatch = usePlayerDispatch();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create audio element once
  if (!audioRef.current) {
    audioRef.current = new Audio();
    audioRef.current.preload = 'metadata';
  }

  const audio = audioRef.current;

  // Sync volume
  useEffect(() => {
    audio.volume = state.volume;
  }, [audio, state.volume]);

  // Wire audio events
  useEffect(() => {
    const onTimeUpdate = () => {
      dispatch({ type: 'SET_TIME', time: audio.currentTime });
    };
    const onLoadedMetadata = () => {
      dispatch({ type: 'SET_DURATION', duration: audio.duration });
    };
    const onEnded = () => {
      dispatch({ type: 'NEXT' });
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, [audio, dispatch]);

  // Load and play when currentTrack changes
  useEffect(() => {
    if (!state.currentTrack) return;

    const src = `/api/stream/${state.currentTrack.id}`;
    if (audio.src !== window.location.origin + src) {
      audio.src = src;
      audio.load();
    }

    if (state.isPlaying) {
      audio.play().catch((err) => {
        console.error('Playback error:', err);
      });
    }
  }, [audio, state.currentTrack, state.currentTrack?.id]);

  // Sync play/pause state
  useEffect(() => {
    if (!state.currentTrack) return;
    if (state.isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [audio, state.isPlaying, state.currentTrack]);

  // Handle PREV restarting current track
  useEffect(() => {
    if (state.currentTime === 0 && audio.currentTime > 0 && state.currentTrack) {
      audio.currentTime = 0;
    }
  }, [audio, state.currentTime, state.currentTrack]);

  const playTrack = useCallback(
    (track: Track, queue?: Track[], queueIndex?: number) => {
      dispatch({
        type: 'PLAY_TRACK',
        track,
        queue,
        queueIndex,
      });
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
      audio.currentTime = time;
      dispatch({ type: 'SET_TIME', time });
    },
    [audio, dispatch]
  );

  const setVolume = useCallback(
    (volume: number) => {
      dispatch({ type: 'SET_VOLUME', volume });
    },
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
