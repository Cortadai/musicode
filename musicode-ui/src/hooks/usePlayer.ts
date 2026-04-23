import { useEffect, useCallback, useRef, useState } from 'react';
import { usePlayerState, usePlayerDispatch } from '../context/PlayerContext';
import audioGraph from '../audio/audioGraph';
import { useScrobble } from './useScrobble';
import { useMediaSession } from './useMediaSession';
import { useGapless } from './useGapless';
import type { Track } from '../types';

let audioOwnerRef: symbol | null = null;

export function usePlayer() {
  const state = usePlayerState();
  const dispatch = usePlayerDispatch();
  const ownerSymbol = useRef(Symbol('player-owner'));

  // Claim ownership — state (not ref) so child hooks re-render when claimed
  const [isOwner, setIsOwner] = useState(false);
  useEffect(() => {
    if (audioOwnerRef === null) {
      audioOwnerRef = ownerSymbol.current;
      setIsOwner(true);
    }
    return () => {
      if (audioOwnerRef === ownerSymbol.current) {
        audioOwnerRef = null;
        setIsOwner(false);
      }
    };
  }, []);

  // --- Scrobble: report play at 50% ---
  const { status: scrobbleStatus } = useScrobble({
    trackId: state.currentTrack?.id ?? null,
    currentTime: state.currentTime,
    duration: state.duration,
  });

  // --- Gapless & crossfade ---
  const handleTimeUpdate = useCallback((time: number) => {
    dispatch({ type: 'SET_TIME', time });
  }, [dispatch]);

  const { setCrossfadeDuration, getCrossfadeDuration } = useGapless({
    currentTrack: state.currentTrack,
    queue: state.queue,
    queueIndex: state.queueIndex,
    repeatMode: state.repeatMode,
    isPlaying: state.isPlaying,
    dispatch,
    isOwner: isOwner,
    onTimeUpdate: handleTimeUpdate,
  });

  // --- Media Session ---
  const mediaNext = useCallback(() => {
    audioGraph.cancelPrepare();
    dispatch({ type: 'NEXT' });
  }, [dispatch]);

  const mediaPrev = useCallback(() => {
    audioGraph.cancelPrepare();
    dispatch({ type: 'PREV' });
  }, [dispatch]);

  const mediaResume = useCallback(() => dispatch({ type: 'RESUME' }), [dispatch]);
  const mediaPause = useCallback(() => dispatch({ type: 'PAUSE' }), [dispatch]);

  const mediaSeek = useCallback((time: number) => {
    audioGraph.seek(time);
    dispatch({ type: 'SET_TIME', time });
  }, [dispatch]);

  useMediaSession({
    track: state.currentTrack,
    isPlaying: state.isPlaying,
    currentTime: state.currentTime,
    duration: state.duration,
    isOwner: isOwner,
    onPlay: mediaResume,
    onPause: mediaPause,
    onNext: mediaNext,
    onPrev: mediaPrev,
    onSeek: mediaSeek,
  });

  // --- Audio sync effects (owner only) ---

  useEffect(() => {
    audioGraph.setVolume(state.volume);
  }, [state.volume]);

  // Load and play when currentTrack changes
  useEffect(() => {
    if (!isOwner || !state.currentTrack) return;

    const src = `/api/stream/${state.currentTrack.id}`;
    const fullSrc = window.location.origin + src;

    if (audioGraph.getCurrentSrc() === fullSrc) {
      const dur = audioGraph.getDuration();
      if (dur > 0) dispatch({ type: 'SET_DURATION', duration: dur });
      return;
    }

    if (audioGraph.isCrossfading()) return;

    audioGraph.setSource(src);
    if (state.isPlaying) audioGraph.play();
  }, [state.currentTrack?.id]);

  // Sync play/pause state
  useEffect(() => {
    if (!isOwner || !state.currentTrack) return;
    if (state.isPlaying) audioGraph.play();
    else audioGraph.pause();
  }, [state.isPlaying]);

  // Handle PREV/repeat-one: when reducer resets currentTime to 0
  useEffect(() => {
    if (!isOwner) return;
    if (state.currentTime === 0 && audioGraph.getCurrentTime() > 0 && state.currentTrack) {
      audioGraph.seek(0);
      if (state.isPlaying) audioGraph.play();
    }
  }, [state.currentTime]);

  // --- Public API (unchanged) ---

  const playTrack = useCallback(
    (track: Track, queue?: Track[], queueIndex?: number) => {
      audioGraph.cancelPrepare();
      dispatch({ type: 'PLAY_TRACK', track, queue, queueIndex });
    },
    [dispatch]
  );

  const playAlbum = useCallback(
    (tracks: Track[], startIndex = 0) => {
      if (tracks.length === 0) return;
      audioGraph.cancelPrepare();
      dispatch({ type: 'PLAY_TRACK', track: tracks[startIndex], queue: tracks, queueIndex: startIndex });
    },
    [dispatch]
  );

  const pause = useCallback(() => dispatch({ type: 'PAUSE' }), [dispatch]);
  const resume = useCallback(() => dispatch({ type: 'RESUME' }), [dispatch]);

  const next = useCallback(() => {
    audioGraph.cancelPrepare();
    dispatch({ type: 'NEXT' });
  }, [dispatch]);

  const prev = useCallback(() => {
    audioGraph.cancelPrepare();
    dispatch({ type: 'PREV' });
  }, [dispatch]);

  const toggleShuffle = useCallback(() => dispatch({ type: 'TOGGLE_SHUFFLE' }), [dispatch]);
  const toggleRepeat = useCallback(() => dispatch({ type: 'TOGGLE_REPEAT' }), [dispatch]);

  const seek = useCallback(
    (time: number) => {
      audioGraph.seek(time);
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
    setCrossfadeDuration,
    getCrossfadeDuration,
    scrobbleStatus,
  };
}
