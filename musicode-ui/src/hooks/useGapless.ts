import { useEffect, useRef, useCallback } from 'react';
import audioGraph from '../audio/audioGraph';
import { loadPreferences, savePreferences } from '../audio/audioPreferences';
import type { Track } from '../types';
import type { PlayerAction } from '../context/PlayerContext';

const BASE_PRELOAD_THRESHOLD = 3;

interface UseGaplessParams {
  currentTrack: Track | null;
  queue: Track[];
  queueIndex: number;
  repeatMode: string;

  dispatch: React.Dispatch<PlayerAction>;
  isOwner: boolean;
  onTimeUpdate: (time: number) => void;
}

export function useGapless({
  currentTrack,
  queue,
  queueIndex,
  repeatMode,

  dispatch,
  isOwner,
  onTimeUpdate,
}: UseGaplessParams) {
  const crossfadeDurationRef = useRef<number>(loadPreferences().crossfadeDuration);
  const crossfadeTriggeredRef = useRef<number | null>(null);
  const preloadTriggeredRef = useRef<number | null>(null);

  // Keep refs in sync to avoid stale closures in audioGraph callbacks
  const queueRef = useRef(queue);
  const queueIndexRef = useRef(queueIndex);
  const repeatModeRef = useRef(repeatMode);
  const currentTrackRef = useRef(currentTrack);

  useEffect(() => { queueRef.current = queue; }, [queue]);
  useEffect(() => { queueIndexRef.current = queueIndex; }, [queueIndex]);
  useEffect(() => { repeatModeRef.current = repeatMode; }, [repeatMode]);
  useEffect(() => { currentTrackRef.current = currentTrack; }, [currentTrack]);

  const getNextTrackSrc = useCallback((): string | null => {
    const q = queueRef.current;
    const idx = queueIndexRef.current;
    const repeat = repeatModeRef.current;

    if (repeat === 'one') return null;

    const nextIdx = idx + 1;
    if (nextIdx < q.length) {
      return `/api/stream/${q[nextIdx].id}`;
    }
    if (repeat === 'all' && q.length > 0) {
      return `/api/stream/${q[0].id}`;
    }
    return null;
  }, []);

  // Wire audioGraph callbacks — owner only
  useEffect(() => {
    if (!isOwner) return;

    audioGraph.setOnTimeUpdate((time: number) => {
      onTimeUpdate(time);

      const cfDuration = crossfadeDurationRef.current;
      const preloadThreshold = Math.max(BASE_PRELOAD_THRESHOLD, cfDuration + 1);
      const remaining = audioGraph.getRemaining();
      const duration = audioGraph.getDuration();
      const currentId = currentTrackRef.current?.id ?? null;

      // Pre-load next track when approaching end
      if (
        remaining <= preloadThreshold &&
        remaining > 0 &&
        duration > preloadThreshold &&
        currentId !== null &&
        preloadTriggeredRef.current !== currentId
      ) {
        const nextSrc = getNextTrackSrc();
        if (nextSrc) {
          audioGraph.prepareNext(nextSrc);
          preloadTriggeredRef.current = currentId;
          console.debug('[gapless] Pre-loading next track (threshold:', preloadThreshold + 's)');
        }
      }

      // Crossfade trigger
      if (
        cfDuration > 0 &&
        remaining <= cfDuration &&
        remaining > 0 &&
        duration > cfDuration + 1 &&
        currentId !== null &&
        crossfadeTriggeredRef.current !== currentId &&
        audioGraph.isNextPrepared() &&
        !audioGraph.isCrossfading()
      ) {
        crossfadeTriggeredRef.current = currentId;
        const started = audioGraph.crossfade(remaining);
        if (started) {
          console.debug(`[gapless] Crossfade started: ${remaining.toFixed(1)}s remaining`);
          dispatch({ type: 'NEXT' });
        }
      }
    });

    audioGraph.setOnLoadedMetadata(() => {
      dispatch({ type: 'SET_DURATION', duration: audioGraph.getDuration() });
    });

    audioGraph.setOnEnded(() => {
      if (audioGraph.isCrossfading()) {
        console.debug('[gapless] onEnded during crossfade — ignoring (already transitioned)');
        return;
      }

      if (audioGraph.isNextPrepared()) {
        const swapped = audioGraph.swap();
        if (swapped) {
          console.debug('[gapless] Swapped to next element');
          dispatch({ type: 'NEXT' });
          return;
        }
      }
      dispatch({ type: 'NEXT' });
    });

    return () => {
      audioGraph.setOnTimeUpdate(null);
      audioGraph.setOnLoadedMetadata(null);
      audioGraph.setOnEnded(null);
    };
  }, [isOwner, dispatch, getNextTrackSrc, onTimeUpdate]);

  // Reset preload/crossfade tracking on track change
  useEffect(() => {
    preloadTriggeredRef.current = null;
    crossfadeTriggeredRef.current = null;
  }, [currentTrack?.id]);

  const setCrossfadeDuration = useCallback((seconds: number) => {
    const clamped = Math.max(0, Math.min(12, seconds));
    crossfadeDurationRef.current = clamped;
    savePreferences({ crossfadeDuration: clamped });
    console.debug('[gapless] Crossfade duration set to', clamped + 's');
  }, []);

  const getCrossfadeDuration = useCallback(() => crossfadeDurationRef.current, []);

  return { setCrossfadeDuration, getCrossfadeDuration };
}
