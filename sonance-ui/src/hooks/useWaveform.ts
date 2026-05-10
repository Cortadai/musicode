import { useEffect, useRef, useState } from 'react';
import { getWaveform } from '../api/waveforms';

const cache = new Map<number, number[]>();

export function useWaveform(trackId: number | undefined) {
  const [peaks, setPeaks] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!trackId) {
      setPeaks(null);
      return;
    }

    const cached = cache.get(trackId);
    if (cached) {
      setPeaks(cached);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setPeaks(null);

    getWaveform(trackId)
      .then((res) => {
        if (!controller.signal.aborted) {
          console.debug('[waveform] loaded', trackId, res.peaks?.length, 'bars');
          cache.set(trackId, res.peaks);
          setPeaks(res.peaks);
        }
      })
      .catch((err) => {
        console.warn('[waveform] fetch failed for track', trackId, err?.response?.status || err?.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [trackId]);

  return { peaks, loading };
}
