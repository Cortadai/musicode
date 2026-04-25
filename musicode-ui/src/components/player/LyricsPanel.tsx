import { useEffect, useRef, useState, useCallback } from 'react';
import { Music2, RefreshCw, Mic2 } from 'lucide-react';
import { getLyrics, retryLyrics, type LyricsResponse } from '../../api/lyrics';
import { parseLrc, findActiveLine, type LrcLine } from '../../utils/lrcParser';

interface Props {
  trackId: number;
  currentTime: number;
}

export default function LyricsPanel({ trackId, currentTime }: Props) {
  const [lyrics, setLyrics] = useState<LyricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [lines, setLines] = useState<LrcLine[]>([]);
  const [activeLine, setActiveLine] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<Map<number, HTMLParagraphElement>>(new Map());
  const userScrolledRef = useRef(false);
  const scrollTimerRef = useRef<number>(undefined);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLines([]);
    setActiveLine(-1);
    userScrolledRef.current = false;

    getLyrics(trackId)
      .then((data) => {
        if (cancelled) return;
        setLyrics(data);
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
    const idx = findActiveLine(lines, currentTime);
    if (idx !== activeLine) setActiveLine(idx);
  }, [currentTime, lines, activeLine]);

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
    return () => clearTimeout(scrollTimerRef.current);
  }, []);

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
      <div className="flex items-center justify-center h-full text-zinc-500">
        <Music2 className="w-5 h-5 animate-pulse" />
      </div>
    );
  }

  if (!lyrics || lyrics.status === 'NOT_FOUND' || lyrics.status === 'NOT_SEARCHED') {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-zinc-500">
        <Music2 className="w-8 h-8" />
        <p className="text-sm">No lyrics found</p>
        <button
          onClick={handleRetry}
          disabled={retrying}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${retrying ? 'animate-spin' : ''}`} />
          {retrying ? 'Searching…' : 'Search again'}
        </button>
      </div>
    );
  }

  if (lyrics.status === 'INSTRUMENTAL') {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-zinc-500">
        <Mic2 className="w-8 h-8" />
        <p className="text-sm">Instrumental</p>
      </div>
    );
  }

  if (lines.length > 0) {
    return (
      <div className="h-full flex flex-col py-12">
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-6 scroll-smooth min-h-0"
        >
          <div className="flex flex-col gap-2 min-h-full justify-center">
            {lines.map((line, i) => (
              <p
                key={i}
                ref={(el) => setLineRef(i, el)}
                className={`text-lg font-medium leading-relaxed transition-all duration-300 ${
                  i === activeLine
                    ? 'text-zinc-100 scale-[1.02] origin-left'
                    : 'text-zinc-600'
                }`}
              >
                {line.text}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (lyrics.plainLyrics) {
    return (
      <div className="h-full flex flex-col py-12">
        <div className="flex-1 overflow-y-auto px-6 min-h-0">
          <div className="whitespace-pre-wrap text-sm text-zinc-400 leading-relaxed">
            {lyrics.plainLyrics}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
