import { useRef, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { recordPlay } from '../api/plays';

export type ScrobbleStatus = 'idle' | 'reported' | 'error';

interface UseScrobbleParams {
  trackId: number | null;
  currentTime: number;
  duration: number;
  enabled: boolean;
}

export function useScrobble({ trackId, currentTime, duration, enabled }: UseScrobbleParams) {
  const queryClient = useQueryClient();
  const playReportedRef = useRef<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [status, setStatus] = useState<ScrobbleStatus>('idle');

  useEffect(() => {
    if (
      enabled &&
      duration > 0 &&
      currentTime > duration * 0.5 &&
      trackId !== null &&
      playReportedRef.current !== trackId
    ) {
      const listenDuration = Math.round(currentTime);
      playReportedRef.current = trackId;
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;
      recordPlay(trackId, listenDuration, { signal: controller.signal })
        .then(() => {
          if (!controller.signal.aborted) {
            setStatus('reported');
            queryClient.invalidateQueries({ queryKey: ['stats'] });
          }
        })
        .catch((err) => {
          if (controller.signal.aborted) return;
          console.debug('[scrobble] Failed to record play:', err.message);
          setStatus('error');
        });
    }
  }, [trackId, currentTime, duration, enabled, queryClient]);

  // Reset when track changes
  useEffect(() => {
    playReportedRef.current = null;
    setStatus('idle');
  }, [trackId]);

  // Abort on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return { status };
}
