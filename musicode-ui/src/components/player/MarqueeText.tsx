import { memo, useRef, useState, useEffect, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

function MarqueeText({ children, className = '', style }: Props) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const check = () => setOverflows(inner.scrollWidth > outer.clientWidth + 1);
    check();

    const ro = new ResizeObserver(check);
    ro.observe(outer);
    return () => ro.disconnect();
  }, [children]);

  return (
    <div ref={outerRef} className={`overflow-hidden whitespace-nowrap group ${className}`} style={style}>
      <span
        ref={innerRef}
        className={overflows ? 'inline-block marquee-scroll group-hover:[animation-play-state:paused]' : 'inline-block'}
        style={overflows ? { paddingRight: '2rem' } : undefined}
      >
        {children}
        {overflows && (
          <span aria-hidden="true" style={{ paddingLeft: '2rem' }}>
            {children}
          </span>
        )}
      </span>
    </div>
  );
}

export default memo(MarqueeText);
