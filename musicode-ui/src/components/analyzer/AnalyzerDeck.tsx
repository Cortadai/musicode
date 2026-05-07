import { useRef, useEffect, useCallback } from 'react';
import { usePlayerState } from '../../context/PlayerContext';
import { useFrameScheduler } from '../../hooks/useFrameScheduler';
import { deckDataSource } from '../../audio/analyzerDeckDataSource';
import { useDeckStore } from './useDeckStore';
import type { ScopeRenderer } from './types';
import './AnalyzerDeck.css';

interface Props {
  scopeMap: Map<string, ScopeRenderer>;
}

const DECK_HEIGHT = 100;

export default function AnalyzerDeck({ scopeMap }: Props) {
  const { visible, activeScopes, proportions } = useDeckStore();
  const { isPlaying } = usePlayerState();
  const canvasRefs = useRef<Map<string, HTMLCanvasElement>>(new Map());
  const ctxCache = useRef<Map<string, CanvasRenderingContext2D>>(new Map());

  const setCanvasRef = useCallback((id: string, el: HTMLCanvasElement | null) => {
    if (el) {
      canvasRefs.current.set(id, el);
    } else {
      canvasRefs.current.delete(id);
      ctxCache.current.delete(id);
    }
  }, []);

  // Resize canvases to match their CSS size at device pixel ratio
  useEffect(() => {
    if (!visible) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const canvas = entry.target as HTMLCanvasElement;
        const dpr = window.devicePixelRatio || 1;
        const rect = entry.contentRect;
        const w = Math.round(rect.width * dpr);
        const h = Math.round(rect.height * dpr);
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
        }
      }
    });

    canvasRefs.current.forEach((canvas) => observer.observe(canvas));
    return () => observer.disconnect();
  }, [visible, activeScopes]);

  // Frame loop — render all active scopes
  const renderFrame = useCallback(() => {
    const dpr = window.devicePixelRatio || 1;

    for (const scopeId of activeScopes) {
      const canvas = canvasRefs.current.get(scopeId);
      if (!canvas) continue;

      let ctx = ctxCache.current.get(scopeId);
      if (!ctx) {
        const newCtx = canvas.getContext('2d', { alpha: false });
        if (!newCtx) continue;
        ctx = newCtx;
        ctxCache.current.set(scopeId, ctx);
      }
      if (!ctx) continue;

      const scope = scopeMap.get(scopeId);
      if (!scope) continue;

      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.save();
      ctx.scale(dpr, dpr);
      scope.render(ctx, w, h, deckDataSource);
      ctx.restore();
    }
  }, [activeScopes, scopeMap]);

  useFrameScheduler(renderFrame, visible && isPlaying);

  // Draw one idle frame when deck becomes visible but not playing
  useEffect(() => {
    if (visible && !isPlaying) {
      requestAnimationFrame(renderFrame);
    }
  }, [visible, isPlaying, renderFrame]);

  if (!visible) return null;

  const totalProportion = proportions.reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="analyzer-deck" style={{ height: DECK_HEIGHT }}>
      {activeScopes.map((scopeId, i) => {
        const flex = (proportions[i] ?? 1) / totalProportion;
        return (
          <div
            key={scopeId}
            className="analyzer-deck__scope"
            style={{ flex }}
          >
            <canvas
              ref={(el) => setCanvasRef(scopeId, el)}
              className="analyzer-deck__canvas"
            />
            <span className="analyzer-deck__label">
              {scopeMap.get(scopeId)?.name ?? scopeId}
            </span>
          </div>
        );
      })}
    </div>
  );
}
