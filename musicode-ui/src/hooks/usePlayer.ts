import { useEffect, useCallback, useRef } from 'react';
import { usePlayerState, usePlayerDispatch } from '../context/PlayerContext';
import { recordPlay } from '../api/plays';
import audioGraph from '../audio/audioGraph';
import { loadPreferences, savePreferences } from '../audio/audioPreferences';
import type { Track } from '../types';

/**
 * Player hook — wires React state to the centralized audioGraph.
 *
 * All audio operations (play, pause, seek, volume, source loading) are delegated
 * to audioGraph. This hook manages: event wiring, state sync, Media Session API,
 * scrobble tracking, gapless pre-loading, and exposes playback controls to React.
 *
 * GAPLESS STRATEGY:
 * - On timeupdate, when ≤3s remain, pre-load the next track on the inactive element
 * - On ended, swap elements (audio starts immediately) then dispatch NEXT for React state
 * - Manual skip cancels any pending pre-load and loads directly on the active element
 *
 * Owner tracking prevents duplicate event wiring when multiple components
 * call usePlayer() simultaneously (PlayerBar + TrackList).
 */
let audioOwnerRef: symbol | null = null;

// Pre-load threshold in seconds — how early to start loading the next track
const BASE_PRELOAD_THRESHOLD = 3;

export function usePlayer() {
  const state = usePlayerState();
  const dispatch = usePlayerDispatch();
  const ownerSymbol = useRef(Symbol('player-owner'));
  const playReportedRef = useRef<number | null>(null);
  const currentTrackRef = useRef<Track | null>(null);

  // Crossfade preference — loaded once, updated when user changes it
  const crossfadeDurationRef = useRef<number>(loadPreferences().crossfadeDuration);
  // Whether crossfade was already triggered for the current track
  const crossfadeTriggeredRef = useRef<number | null>(null);

  // Refs for gapless — need current values in event handlers without stale closures
  const queueRef = useRef<Track[]>([]);
  const queueIndexRef = useRef<number>(-1);
  const repeatModeRef = useRef<string>('off');
  const isPlayingRef = useRef<boolean>(false);

  // Keep refs in sync with state
  useEffect(() => { currentTrackRef.current = state.currentTrack; }, [state.currentTrack]);
  useEffect(() => { queueRef.current = state.queue; }, [state.queue]);
  useEffect(() => { queueIndexRef.current = state.queueIndex; }, [state.queueIndex]);
  useEffect(() => { repeatModeRef.current = state.repeatMode; }, [state.repeatMode]);
  useEffect(() => { isPlayingRef.current = state.isPlaying; }, [state.isPlaying]);

  // Compute the next track URL based on current queue state (no dispatch needed)
  const getNextTrackSrc = useCallback((): string | null => {
    const queue = queueRef.current;
    const idx = queueIndexRef.current;
    const repeat = repeatModeRef.current;

    if (repeat === 'one') return null; // repeat-one restarts, no pre-load

    const nextIdx = idx + 1;
    if (nextIdx < queue.length) {
      return `/api/stream/${queue[nextIdx].id}`;
    }
    // Wrap around for repeat-all
    if (repeat === 'all' && queue.length > 0) {
      return `/api/stream/${queue[0].id}`;
    }
    return null; // End of queue, no repeat
  }, []);

  // Track whether we've already triggered pre-load for the current track
  const preloadTriggeredRef = useRef<number | null>(null);

  // Wire audio events via audioGraph callbacks — only one usePlayer instance does this
  useEffect(() => {
    if (audioOwnerRef !== null) return;
    audioOwnerRef = ownerSymbol.current;

    audioGraph.setOnTimeUpdate((time: number) => {
      dispatch({ type: 'SET_TIME', time });

      // Report play when user has listened past 50% of the track
      const track = currentTrackRef.current;
      const duration = audioGraph.getDuration();
      if (
        duration > 0 &&
        time > duration * 0.5 &&
        track &&
        playReportedRef.current !== track.id
      ) {
        const listenDuration = Math.round(time);
        playReportedRef.current = track.id;
        recordPlay(track.id, listenDuration).catch((err) => {
          console.debug('[player] Failed to record play:', err.message);
        });
        console.debug('[player] Play recorded for track:', track.id);
      }

      // Dynamic pre-load threshold: must be at least crossfadeDuration + 1s
      // so the next track is loaded before the crossfade ramp starts.
      const cfDuration = crossfadeDurationRef.current;
      const preloadThreshold = Math.max(BASE_PRELOAD_THRESHOLD, cfDuration + 1);

      // Pre-load: when ≤threshold remain, pre-load next track
      const remaining = audioGraph.getRemaining();
      const currentId = currentTrackRef.current?.id ?? null;
      if (
        remaining <= preloadThreshold &&
        remaining > 0 &&
        duration > preloadThreshold && // Don't pre-load for very short tracks
        currentId !== null &&
        preloadTriggeredRef.current !== currentId
      ) {
        const nextSrc = getNextTrackSrc();
        if (nextSrc) {
          audioGraph.prepareNext(nextSrc);
          preloadTriggeredRef.current = currentId;
          console.debug('[player] Pre-loading next track (threshold:', preloadThreshold + 's)');
        }
      }

      // Crossfade trigger: when remaining <= crossfadeDuration, start the crossfade
      if (
        cfDuration > 0 &&
        remaining <= cfDuration &&
        remaining > 0 &&
        duration > cfDuration + 1 && // Track must be longer than crossfade
        currentId !== null &&
        crossfadeTriggeredRef.current !== currentId &&
        audioGraph.isNextPrepared() &&
        !audioGraph.isCrossfading()
      ) {
        crossfadeTriggeredRef.current = currentId;
        const started = audioGraph.crossfade(remaining); // Use actual remaining, not cfDuration
        if (started) {
          console.debug(`[player] Crossfade started: ${remaining.toFixed(1)}s remaining`);
          // Dispatch NEXT to update React state — audio is already transitioning
          dispatch({ type: 'NEXT' });
        }
      }
    });

    audioGraph.setOnLoadedMetadata(() => {
      dispatch({ type: 'SET_DURATION', duration: audioGraph.getDuration() });
    });

    audioGraph.setOnEnded(() => {
      // If a crossfade already handled this transition, the old element naturally
      // reaches its end — ignore, NEXT was already dispatched when crossfade started.
      if (audioGraph.isCrossfading()) {
        console.debug('[player] onEnded during crossfade — ignoring (already transitioned)');
        return;
      }

      // Try gapless swap first — if next was pre-loaded, swap starts playback instantly
      if (audioGraph.isNextPrepared()) {
        const swapped = audioGraph.swap();
        if (swapped) {
          console.debug('[player] Gapless: swapped to next element');
          dispatch({ type: 'NEXT' });
          return;
        }
      }
      // Fallback: standard transition (reducer handles NEXT, effect loads + plays)
      dispatch({ type: 'NEXT' });
    });

    return () => {
      audioGraph.setOnTimeUpdate(null);
      audioGraph.setOnLoadedMetadata(null);
      audioGraph.setOnEnded(null);
      if (audioOwnerRef === ownerSymbol.current) {
        audioOwnerRef = null;
      }
    };
  }, [dispatch, getNextTrackSrc]);

  // Sync volume changes to the audioGraph GainNode
  useEffect(() => {
    audioGraph.setVolume(state.volume);
  }, [state.volume]);

  // Load and play when currentTrack changes
  useEffect(() => {
    if (audioOwnerRef !== ownerSymbol.current) return;
    if (!state.currentTrack) return;

    // Reset play reporting, pre-load, and crossfade tracking for the new track
    playReportedRef.current = null;
    preloadTriggeredRef.current = null;
    crossfadeTriggeredRef.current = null;

    const src = `/api/stream/${state.currentTrack.id}`;
    const fullSrc = window.location.origin + src;

    // If the active element already has this source (from a gapless swap), skip loading
    if (audioGraph.getCurrentSrc() === fullSrc) {
      // Source already set via swap — just sync duration when metadata arrives
      console.debug('[player] Track already loaded (gapless swap):', state.currentTrack.title);
      // Re-dispatch duration in case loadedmetadata already fired on the swapped element
      const dur = audioGraph.getDuration();
      if (dur > 0) {
        dispatch({ type: 'SET_DURATION', duration: dur });
      }
      return;
    }

    // If a crossfade is in progress, the audio transition is already handled —
    // don't call setSource (which would cancelPrepare → cancelCrossfade).
    // Duration will sync once the crossfade completes and the active slot flips.
    if (audioGraph.isCrossfading()) {
      console.debug('[player] Track change during crossfade — skipping setSource:', state.currentTrack.title);
      return;
    }

    console.debug('[player] Loading track:', state.currentTrack.title, '→', src);
    audioGraph.setSource(src); // This also cancels any pending pre-load

    if (state.isPlaying) {
      audioGraph.play();
    }
  }, [state.currentTrack?.id]);

  // Sync play/pause state
  useEffect(() => {
    if (audioOwnerRef !== ownerSymbol.current) return;
    if (!state.currentTrack) return;

    if (state.isPlaying) {
      audioGraph.play();
    } else {
      audioGraph.pause();
    }
  }, [state.isPlaying]);

  // Handle PREV/repeat-one: when reducer resets currentTime to 0, sync to audio
  useEffect(() => {
    if (audioOwnerRef !== ownerSymbol.current) return;
    if (state.currentTime === 0 && audioGraph.getCurrentTime() > 0 && state.currentTrack) {
      audioGraph.seek(0);
      if (state.isPlaying) {
        audioGraph.play();
      }
    }
  }, [state.currentTime]);

  // --- Media Session API ---

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
      ['nexttrack', () => {
        audioGraph.cancelPrepare(); // Cancel gapless pre-load on manual skip
        dispatch({ type: 'NEXT' });
      }],
      ['previoustrack', () => {
        audioGraph.cancelPrepare();
        dispatch({ type: 'PREV' });
      }],
    ];

    for (const [action, handler] of actions) {
      navigator.mediaSession.setActionHandler(action, handler);
    }

    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (details.seekTime != null) {
        audioGraph.seek(details.seekTime);
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
      audioGraph.cancelPrepare(); // Cancel any pending pre-load
      dispatch({ type: 'PLAY_TRACK', track, queue, queueIndex });
    },
    [dispatch]
  );

  const playAlbum = useCallback(
    (tracks: Track[], startIndex = 0) => {
      if (tracks.length === 0) return;
      audioGraph.cancelPrepare();
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

  const setCrossfadeDuration = useCallback((seconds: number) => {
    const clamped = Math.max(0, Math.min(12, seconds));
    crossfadeDurationRef.current = clamped;
    savePreferences({ crossfadeDuration: clamped });
    console.debug('[player] Crossfade duration set to', clamped + 's');
  }, []);

  const getCrossfadeDuration = useCallback(() => crossfadeDurationRef.current, []);

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
  };
}
