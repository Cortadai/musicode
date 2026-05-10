import { useRef, useState, useCallback, useEffect, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  title: string;
  children: ReactNode;
}

export default function Carousel({ title, children }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      ro.disconnect();
    };
  }, [checkScroll]);

  const scroll = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2
          className="text-lg font-semibold"
          style={{ color: 'var(--mc-text-primary)' }}
        >
          {title}
        </h2>
        <div className="flex gap-1">
          <button
            onClick={() => scroll(-1)}
            disabled={!canScrollLeft}
            className="p-1.5 rounded-lg transition-colors disabled:opacity-30"
            style={{ color: 'var(--mc-text-muted)' }}
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll(1)}
            disabled={!canScrollRight}
            className="p-1.5 rounded-lg transition-colors disabled:opacity-30"
            style={{ color: 'var(--mc-text-muted)' }}
            aria-label="Scroll right"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-1"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {children}
      </div>
    </section>
  );
}
