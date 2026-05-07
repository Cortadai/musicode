import { useEffect, useRef } from 'react';

type FrameCallback = (timestamp: number) => void;

/**
 * Drives a requestAnimationFrame loop, calling `callback` each frame
 * while `active` is true. Automatically pauses when inactive.
 *
 * Optional FPS cap — if set, skips frames that arrive before the
 * minimum interval. Default: uncapped (display-sync, typically 60fps).
 */
export function useFrameScheduler(
  callback: FrameCallback,
  active: boolean,
  fpsCap?: number,
): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const rafRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;

    const minInterval = fpsCap ? 1000 / fpsCap : 0;

    function loop(timestamp: number) {
      if (minInterval > 0) {
        const elapsed = timestamp - lastFrameRef.current;
        if (elapsed < minInterval) {
          rafRef.current = requestAnimationFrame(loop);
          return;
        }
        lastFrameRef.current = timestamp - (elapsed % minInterval);
      }
      callbackRef.current(timestamp);
      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [active, fpsCap]);
}
