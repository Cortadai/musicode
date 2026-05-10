import { useRef, useEffect, useCallback, useState } from 'react';
import { usePlayerState } from '../../context/PlayerContext';
import { useFrameScheduler } from '../../hooks/useFrameScheduler';
import { deckDataSource, setDeckFFTSize } from '../../audio/analyzerDeckDataSource';
import { useDeckStore } from './useDeckStore';
import DeckSettings from './DeckSettings';
import ScopeOptionsPopover from './ScopeOptionsPopover';
import { SCOPE_REGISTRY } from './types';
import type { ScopeRenderer } from './types';
import './AnalyzerDeck.css';

interface Props {
  scopeMap: Map<string, ScopeRenderer>;
}

const DECK_HEIGHT = 170;
const MIN_PROPORTION = 0.3;

export default function AnalyzerDeck({ scopeMap }: Props) {
  const { visible, activeScopes, proportions, fftSize, setProportions } = useDeckStore();
  const { isPlaying } = usePlayerState();
  const canvasRefs = useRef<Map<string, HTMLCanvasElement>>(new Map());
  const ctxCache = useRef<Map<string, CanvasRenderingContext2D>>(new Map());
  const deckRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<Map<string, HTMLSpanElement>>(new Map());
  const [optionsScope, setOptionsScope] = useState<string | null>(null);

  useEffect(() => {
    setDeckFFTSize(fftSize);
  }, [fftSize]);

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
  }, [activeScopes]);

  // Frame loop — always runs while playing, skips draw when deck is hidden
  const renderFrame = useCallback(() => {
    const dpr = window.devicePixelRatio || 1;

    for (const scopeId of activeScopes) {
      const canvas = canvasRefs.current.get(scopeId);
      if (!canvas) continue;

      const rect = canvas.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) continue;

      const w = Math.round(rect.width * dpr);
      const h = Math.round(rect.height * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

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

      const cssW = canvas.width / dpr;
      const cssH = canvas.height / dpr;
      ctx.save();
      ctx.scale(dpr, dpr);
      scope.render(ctx, cssW, cssH, deckDataSource);
      ctx.restore();
    }
  }, [activeScopes, scopeMap]);

  useFrameScheduler(renderFrame, isPlaying && visible);

  const totalProportion = proportions.reduce((a, b) => a + b, 0) || 1;

  const handleSplitterDown = useCallback(
    (index: number, e: React.MouseEvent) => {
      e.preventDefault();
      const deck = deckRef.current;
      if (!deck) return;

      const deckRect = deck.getBoundingClientRect();
      const totalWidth = deckRect.width;
      const startX = e.clientX;
      const startProps = [...proportions];
      const leftProp = startProps[index];
      const rightProp = startProps[index + 1];
      const combinedProp = leftProp + rightProp;

      const onMove = (ev: MouseEvent) => {
        const dx = ev.clientX - startX;
        const dProp = (dx / totalWidth) * totalProportion;
        let newLeft = leftProp + dProp;
        let newRight = rightProp - dProp;

        if (newLeft < MIN_PROPORTION) {
          newLeft = MIN_PROPORTION;
          newRight = combinedProp - MIN_PROPORTION;
        }
        if (newRight < MIN_PROPORTION) {
          newRight = MIN_PROPORTION;
          newLeft = combinedProp - MIN_PROPORTION;
        }

        const next = [...startProps];
        next[index] = newLeft;
        next[index + 1] = newRight;
        setProportions(next);
      };

      const onUp = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };

      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    },
    [proportions, totalProportion, setProportions],
  );

  return (
    <div
      ref={deckRef}
      className={`analyzer-deck ${visible ? 'analyzer-deck--open' : ''}`}
      style={{ '--deck-height': `${DECK_HEIGHT}px` } as React.CSSProperties}
    >
      {activeScopes.map((scopeId, i) => {
        const flex = (proportions[i] ?? 1) / totalProportion;
        return (
          <div key={scopeId} style={{ display: 'contents' }}>
            {i > 0 && (
              <div
                className="analyzer-deck__splitter"
                onMouseDown={(e) => handleSplitterDown(i - 1, e)}
              />
            )}
            <div
              className="analyzer-deck__scope"
              style={{ flex }}
            >
              <canvas
                ref={(el) => setCanvasRef(scopeId, el)}
                className="analyzer-deck__canvas"
              />
              {(() => {
                const reg = SCOPE_REGISTRY.find((r) => r.id === scopeId);
                const clickable = reg?.hasOptions;
                return (
                  <span
                    ref={(el) => {
                      if (el) labelRefs.current.set(scopeId, el);
                      else labelRefs.current.delete(scopeId);
                    }}
                    className={`analyzer-deck__label${clickable ? ' analyzer-deck__label--clickable' : ''}`}
                    onClick={clickable ? () => setOptionsScope(optionsScope === scopeId ? null : scopeId) : undefined}
                  >
                    {scopeMap.get(scopeId)?.name ?? scopeId}
                  </span>
                );
              })()}
            </div>
          </div>
        );
      })}
      {visible && <DeckSettings />}
      {optionsScope && (
        <ScopeOptionsPopover
          scopeId={optionsScope}
          anchorEl={labelRefs.current.get(optionsScope) ?? null}
          onClose={() => setOptionsScope(null)}
        />
      )}
    </div>
  );
}
