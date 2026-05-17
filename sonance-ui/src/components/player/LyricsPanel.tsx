import { useEffect, useRef, useState, useCallback } from 'react';
import { Music2, RefreshCw, Mic2, Minus, Plus } from 'lucide-react';
import { getLyrics, retryLyrics, updateLyricsOffset, type LyricsResponse } from '../../api/lyrics';
import { parseLrc, findActiveLine, type LrcLine } from '../../utils/lrcParser';

interface Props {
  trackId: number;
  currentTime: number;
  compact?: boolean;
}

export default function LyricsPanel({ trackId, currentTime, compact = false }: Props) {
  const [lyrics, setLyrics] = useState<LyricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [lines, setLines] = useState<LrcLine[]>([]);
  const [activeLine, setActiveLine] = useState(-1);
  const [offsetMs, setOffsetMs] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<Map<number, HTMLParagraphElement>>(new Map());
  const userScrolledRef = useRef(false);
  const scrollTimerRef = useRef<number>(undefined);
  const saveTimerRef = useRef<number>(undefined);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLines([]);
    setActiveLine(-1);
    setOffsetMs(0);
    userScrolledRef.current = false;

    getLyrics(trackId)
      .then((data) => {
        if (cancelled) return;
        setLyrics(data);
        setOffsetMs(data.offsetMs ?? 0);
        if (data.syncedLyrics) {
          setLines(parseLrc(data.syncedLyrics));
        }
      })
      .catch(() => {
        if (!cancelled) setLyrics(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [trackId]);

  useEffect(() => {
    if (lines.length === 0) return;
    const adjusted = currentTime + offsetMs / 1000;
    const idx = findActiveLine(lines, adjusted);
    if (idx !== activeLine) setActiveLine(idx);
  }, [currentTime, lines, activeLine, offsetMs]);

  useEffect(() => {
    if (activeLine < 0 || userScrolledRef.current) return;
    const el = lineRefs.current.get(activeLine);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeLine]);

  const handleScroll = useCallback(() => {
    userScrolledRef.current = true;
    clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      userScrolledRef.current = false;
    }, 4000);
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(scrollTimerRef.current);
      clearTimeout(saveTimerRef.current);
    };
  }, []);

  const adjustOffset = useCallback((delta: number) => {
    setOffsetMs((prev) => {
      const next = prev + delta;
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        updateLyricsOffset(trackId, next).catch(() => {});
      }, 800);
      return next;
    });
  }, [trackId]);

  const handleRetry = async () => {
    setRetrying(true);
    try {
      const data = await retryLyrics(trackId);
      setLyrics(data);
      if (data.syncedLyrics) {
        setLines(parseLrc(data.syncedLyrics));
      } else {
        setLines([]);
      }
    } catch {
      // keep existing state
    } finally {
      setRetrying(false);
    }
  };

  const setLineRef = useCallback((idx: number, el: HTMLParagraphElement | null) => {
    if (el) lineRefs.current.set(idx, el);
    else lineRefs.current.delete(idx);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full" style={{ color: 'var(--mc-text-muted)' }}>
        <Music2 className="w-5 h-5 animate-pulse" />
      </div>
    );
  }

  if (!lyrics || lyrics.status === 'NOT_FOUND' || lyrics.status === 'NOT_SEARCHED') {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3" style={{ color: 'var(--mc-text-muted)' }}>
        <Music2 className="w-8 h-8" />
        <p className="text-sm">No lyrics found</p>
        <button
          onClick={handleRetry}
          disabled={retrying}
          className="flex items-center gap-1.5 text-xs mc-interactive-muted transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${retrying ? 'animate-spin' : ''}`} />
          {retrying ? 'Searching…' : 'Search again'}
        </button>
      </div>
    );
  }

  if (lyrics.status === 'INSTRUMENTAL') {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3" style={{ color: 'var(--mc-text-muted)' }}>
        <Mic2 className="w-8 h-8" />
        <p className="text-sm">Instrumental</p>
      </div>
    );
  }

  if (lines.length > 0) {
    const offsetLabel = offsetMs === 0
      ? '±0s'
      : `${offsetMs > 0 ? '+' : ''}${(offsetMs / 1000).toFixed(1)}s`;

    return (
      <div className="h-full flex flex-col">
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-6 scroll-smooth min-h-0"
        >
          <div className="flex flex-col gap-2 min-h-full justify-center selectable">
            {lines.map((line, i) => (
              <p
                key={i}
                ref={(el) => setLineRef(i, el)}
                className={`${compact ? 'text-sm' : 'text-lg'} font-medium leading-relaxed transition-all duration-300 ${
                  i === activeLine
                    ? 'scale-[1.02] origin-left'
                    : ''
                }`}
                style={{ color: i === activeLine ? 'var(--mc-text-primary)' : 'var(--mc-text-muted)' }}
              >
                {line.text}
              </p>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center gap-1.5 px-4 py-2 shrink-0">
          <button
            onClick={() => adjustOffset(-500)}
            className="p-1 rounded mc-interactive-muted transition-colors"
            title="Delay lyrics 0.5s"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span
            className="text-xs font-mono min-w-[3.5rem] text-center"
            style={{ color: offsetMs === 0 ? 'var(--mc-text-muted)' : 'var(--mc-text-secondary)' }}
          >
            {offsetLabel}
          </span>
          <button
            onClick={() => adjustOffset(500)}
            className="p-1 rounded mc-interactive-muted transition-colors"
            title="Advance lyrics 0.5s"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  if (lyrics.plainLyrics) {
    return (
      <div className="h-full flex flex-col py-12">
        <div className="flex-1 overflow-y-auto px-6 min-h-0">
          <div className="whitespace-pre-wrap text-sm leading-relaxed selectable" style={{ color: 'var(--mc-text-secondary)' }}>
            {lyrics.plainLyrics}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
