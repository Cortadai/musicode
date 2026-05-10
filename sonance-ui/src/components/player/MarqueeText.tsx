import { memo, useRef, useState, useEffect, type ReactNode } from 'react';
import { useMarqueePlaybar } from '../../hooks/useMarqueePref';

interface Props {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

function MarqueeText({ children, className = '', style }: Props) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  const [overflows, setOverflows] = useState(false);
  const marqueeEnabled = useMarqueePlaybar();

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

  const shouldAnimate = overflows && marqueeEnabled;

  return (
    <div ref={outerRef} className={`overflow-hidden whitespace-nowrap group ${className}`} style={{ ...style, textOverflow: overflows && !marqueeEnabled ? 'ellipsis' : undefined }}>
      <span
        ref={innerRef}
        className={shouldAnimate ? 'inline-block marquee-scroll group-hover:[animation-play-state:paused]' : 'inline-block'}
        style={shouldAnimate ? { paddingRight: '2rem' } : undefined}
      >
        {children}
        {shouldAnimate && (
          <span aria-hidden="true" style={{ paddingLeft: '2rem' }}>
            {children}
          </span>
        )}
      </span>
    </div>
  );
}

export default memo(MarqueeText);
