import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import eqProcessor, { EQ_PRESETS, GAIN_MIN, GAIN_MAX } from '../../audio/eqProcessor';
import { loadPreferences, savePreferences } from '../../audio/audioPreferences';

function EqPresetDropdown({ preset, onSelect }: { preset: string; onSelect: (name: string) => void }) {
  const [listOpen, setListOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const options = [
    ...EQ_PRESETS.map((p) => ({ value: p.name, label: p.label })),
    ...(preset === 'custom' ? [{ value: 'custom', label: 'Custom' }] : []),
  ];

  const currentLabel = options.find((o) => o.value === preset)?.label ?? preset;

  useEffect(() => {
    if (!listOpen) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setListOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [listOpen]);

  useEffect(() => {
    if (!listOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setListOpen(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [listOpen]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setListOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={listOpen}
        aria-label="EQ preset"
        className="flex items-center justify-between gap-1 text-[11px] border rounded px-1.5 py-0.5 outline-none
          focus-visible:ring-1 w-[100px]"
        style={{
          backgroundColor: 'var(--mc-waveform-buffered)',
          color: 'var(--mc-text-primary)',
          borderColor: 'var(--mc-scrollbar-thumb-hover)',
          ['--tw-ring-color' as string]: 'var(--mc-accent-primary)',
        }}
      >
        {currentLabel}
        <ChevronDown className="w-3 h-3" />
      </button>
      {listOpen && (
        <ul
          role="listbox"
          aria-label="EQ presets"
          className="absolute right-0 top-full mt-1 border rounded shadow-xl z-50 py-0.5 w-[100px]"
          style={{ backgroundColor: 'var(--mc-bg-surface-hover)', borderColor: 'var(--mc-waveform-buffered)' }}
        >
          {options.map((o) => (
            <li
              key={o.value}
              role="option"
              aria-selected={o.value === preset}
              onClick={() => { onSelect(o.value); setListOpen(false); }}
              className="text-[11px] px-2 py-1 cursor-pointer transition-colors"
              style={o.value === preset
                ? { backgroundColor: 'var(--mc-accent-primary-hover)', color: 'var(--mc-text-primary)' }
                : { color: 'var(--mc-text-primary)' }}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function EqPopover() {
  const [open, setOpen] = useState(false);
  const [enabled, setEnabled] = useState(() => loadPreferences().eqEnabled);
  const [bands, setBands] = useState<number[]>(() => loadPreferences().eqBands);
  const [preset, setPreset] = useState(() => loadPreferences().eqPreset);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Apply saved EQ state on mount
  useEffect(() => {
    eqProcessor.setAllGains(bands);
    eqProcessor.setEnabled(enabled);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggle = useCallback(() => {
    const next = !enabled;
    setEnabled(next);
    eqProcessor.setEnabled(next);
    savePreferences({ eqEnabled: next });
  }, [enabled]);

  const handleBandChange = useCallback(
    (bandIndex: number, value: number) => {
      const newBands = [...bands];
      newBands[bandIndex] = value;
      setBands(newBands);
      eqProcessor.setGain(bandIndex, value);
      const p = eqProcessor.getPreset();
      setPreset(p);
      savePreferences({ eqBands: newBands, eqPreset: p });
    },
    [bands]
  );

  const handlePresetChange = useCallback((presetName: string) => {
    const p = EQ_PRESETS.find((x) => x.name === presetName);
    if (!p) return;
    setPreset(presetName);
    setBands([...p.gains]);
    eqProcessor.applyPreset(presetName);
    savePreferences({ eqBands: [...p.gains], eqPreset: presetName });
  }, []);

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
    const firstFocusable = dialogRef.current?.querySelector<HTMLElement>(
      'button, [role="switch"], input, select'
    );
    firstFocusable?.focus();
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
        aria-label={enabled ? `Equalizer: ${preset}` : 'Equalizer: Off'}
        className={`flex items-center justify-center transition-colors ${enabled ? 'mc-toggle-accent' : 'mc-interactive-muted'}`}
      >
        <SlidersHorizontal className="w-4 h-4" />
      </button>
      {open && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-label="Equalizer settings"
          className="absolute bottom-8 right-0 border rounded-lg p-3 shadow-xl z-50 w-64"
          style={{ backgroundColor: 'var(--mc-bg-surface-hover)', borderColor: 'var(--mc-waveform-buffered)' }}
        >
          {/* Header: toggle + preset selector */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: 'var(--mc-text-secondary)' }} id="eq-toggle-label">Equalizer</span>
              <button
                onClick={handleToggle}
                role="switch"
                aria-checked={enabled}
                aria-labelledby="eq-toggle-label"
                className="w-8 h-4 rounded-full transition-colors relative
                  focus-visible:outline-none focus-visible:ring-2"
                style={{
                  backgroundColor: enabled ? 'var(--mc-accent-primary-hover)' : 'var(--mc-scrollbar-thumb-hover)',
                  ['--tw-ring-color' as string]: 'var(--mc-accent-primary)',
                }}
              >
                <span
                  className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${enabled ? 'left-4' : 'left-0.5'}`}
                />
              </button>
            </div>
            <EqPresetDropdown
              preset={preset}
              onSelect={handlePresetChange}
            />
          </div>

          {/* 5-band vertical sliders */}
          <div className="flex items-end justify-between gap-1 h-28">
            {eqProcessor.BAND_DEFS.map((band, i) => (
              <div key={band.frequency} className="flex flex-col items-center gap-1 flex-1">
                <span className="text-[10px] tabular-nums" style={{ color: 'var(--mc-text-muted)' }} aria-hidden="true">
                  {bands[i] > 0 ? '+' : ''}{bands[i]}
                </span>
                <input
                  type="range"
                  min={GAIN_MIN}
                  max={GAIN_MAX}
                  step={1}
                  value={bands[i]}
                  onChange={(e) => handleBandChange(i, Number(e.target.value))}
                  disabled={!enabled}
                  aria-label={`${band.label} band`}
                  aria-valuetext={`${bands[i] > 0 ? '+' : ''}${bands[i]} dB`}
                  className="eq-slider appearance-none cursor-pointer disabled:opacity-40
                    focus-visible:outline-none focus-visible:ring-2"
                  style={{ accentColor: 'var(--mc-accent-primary)', ['--tw-ring-color' as string]: 'var(--mc-accent-primary)' } as React.CSSProperties}
                  style={{
                    writingMode: 'vertical-lr',
                    direction: 'rtl',
                    height: '80px',
                    width: '20px',
                  }}
                />
                <span className="text-[10px]" style={{ color: 'var(--mc-text-muted)' }} aria-hidden="true">{band.label}</span>
              </div>
            ))}
          </div>

          {/* dB range labels */}
          <div className="flex justify-between mt-1">
            <span className="text-[9px]" style={{ color: 'var(--mc-text-muted)' }}>-12 dB</span>
            <span className="text-[9px]" style={{ color: 'var(--mc-text-muted)' }}>+12 dB</span>
          </div>
        </div>
      )}
    </div>
  );
}
