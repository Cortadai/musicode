import { useCallback, useEffect, useRef, useState } from 'react';
import { Blend } from 'lucide-react';

interface Props {
  getCrossfadeDuration: () => number;
  setCrossfadeDuration: (seconds: number) => void;
}

export default function CrossfadePopover({ getCrossfadeDuration, setCrossfadeDuration }: Props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(() => getCrossfadeDuration());
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const sliderRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Number(e.target.value);
      setValue(val);
      setCrossfadeDuration(val);
    },
    [setCrossfadeDuration]
  );

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Escape key closes, focus management
  useEffect(() => {
    if (!open) return;
    sliderRef.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  return (
    <div className="relative flex items-center" ref={popoverRef}>
      <button
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={value === 0 ? 'Crossfade: Gapless' : `Crossfade: ${value}s`}
        className={`flex items-center justify-center transition-colors ${value > 0 ? 'mc-toggle-accent' : 'mc-interactive-muted'}`}
      >
        <Blend className="w-4 h-4" />
      </button>
      {open && (
        <div
          role="dialog"
          aria-label="Crossfade settings"
          className="absolute bottom-8 right-0 border rounded-lg p-3 shadow-xl z-50 w-48"
          style={{ backgroundColor: 'var(--mc-bg-surface-hover)', borderColor: 'var(--mc-waveform-buffered)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs" style={{ color: 'var(--mc-text-secondary)' }} id="crossfade-label">Crossfade</span>
            <span className="text-xs font-medium" style={{ color: 'var(--mc-text-primary)' }} aria-live="polite">
              {value === 0 ? 'Gapless' : `${value}s`}
            </span>
          </div>
          <input
            ref={sliderRef}
            type="range"
            min={0}
            max={12}
            step={1}
            value={value}
            onChange={handleChange}
            aria-label="Crossfade duration"
            aria-valuetext={value === 0 ? 'Gapless' : `${value} seconds`}
            className="w-full h-1 rounded-full appearance-none cursor-pointer
              focus-visible:outline-none focus-visible:ring-2"
            style={{
              backgroundColor: 'var(--mc-waveform-buffered)',
              accentColor: 'var(--mc-accent-primary)',
              ['--tw-ring-color' as string]: 'var(--mc-accent-primary)',
            }}
          />
          <div className="flex justify-between mt-1">
            <span className="text-[10px]" style={{ color: 'var(--mc-text-muted)' }}>0s</span>
            <span className="text-[10px]" style={{ color: 'var(--mc-text-muted)' }}>12s</span>
          </div>
        </div>
      )}
    </div>
  );
}
