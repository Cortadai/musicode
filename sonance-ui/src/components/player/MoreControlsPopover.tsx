import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Settings2, Activity, Blend, BarChart3,
  CassetteTape, Mic2, SlidersHorizontal, ChevronRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { loadPreferences, savePreferences } from '../../audio/audioPreferences';
import eqProcessor from '../../audio/eqProcessor';

interface Props {
  waveformEnabled: boolean;
  onToggleWaveform: () => void;
  getCrossfadeDuration: () => number;
  setCrossfadeDuration: (seconds: number) => void;
  deckVisible: boolean;
  onToggleDeck: () => void;
  onOpenCassette: () => void;
  isLyricsOpen: boolean;
  onToggleLyrics: () => void;
  onOpenEq: () => void;
}

export default function MoreControlsPopover({
  waveformEnabled,
  onToggleWaveform,
  getCrossfadeDuration,
  setCrossfadeDuration,
  deckVisible,
  onToggleDeck,
  onOpenCassette,
  isLyricsOpen,
  onToggleLyrics,
  onOpenEq,
}: Props) {
  const [open, setOpen] = useState(false);
  const [eqEnabled, setEqEnabled] = useState(() => loadPreferences().eqEnabled);
  const [crossfadeValue, setCrossfadeValue] = useState(() => getCrossfadeDuration());
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      setEqEnabled(loadPreferences().eqEnabled);
      setCrossfadeValue(getCrossfadeDuration());
    }
  }, [open, getCrossfadeDuration]);

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

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const handleToggleEq = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !eqEnabled;
    setEqEnabled(next);
    eqProcessor.setEnabled(next);
    savePreferences({ eqEnabled: next });
  }, [eqEnabled]);

  const handleCrossfadeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Number(e.target.value);
      setCrossfadeValue(val);
      setCrossfadeDuration(val);
    },
    [setCrossfadeDuration],
  );

  const handleOpenEq = useCallback(() => {
    setOpen(false);
    onOpenEq();
  }, [onOpenEq]);

  const handleOpenCassette = useCallback(() => {
    setOpen(false);
    onOpenCassette();
  }, [onOpenCassette]);

  const anyActive = waveformEnabled || eqEnabled || deckVisible || isLyricsOpen || crossfadeValue > 0;

  return (
    <div className="relative flex items-center" ref={popoverRef}>
      <button
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="More controls"
        className={`flex items-center justify-center transition-colors ${open || anyActive ? 'mc-toggle-accent' : 'mc-interactive-muted'}`}
      >
        <Settings2 className="w-[18px] h-[18px]" />
      </button>
      {open && (
        <div
          role="dialog"
          aria-label="Audio controls"
          className="absolute bottom-8 right-0 border rounded-lg shadow-xl z-50"
          style={{
            backgroundColor: 'var(--mc-bg-surface-hover)',
            borderColor: 'var(--mc-waveform-buffered)',
            width: '220px',
          }}
        >
          <div className="p-1.5 flex flex-col gap-0.5">
            <ToggleRow icon={Activity} label="Waveform" active={waveformEnabled} onClick={onToggleWaveform} />
            <ToggleRow icon={BarChart3} label="Analyzer" active={deckVisible} onClick={onToggleDeck} />
            <ToggleRow icon={Mic2} label="Lyrics" active={isLyricsOpen} onClick={onToggleLyrics} />
            <ActionRow icon={CassetteTape} label="Cassette" onClick={handleOpenCassette} warning />
          </div>

          <div className="mx-2" style={{ borderTop: '1px solid var(--mc-waveform-buffered)' }} />

          <div className="p-2 pt-1.5">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <Blend className="w-3.5 h-3.5" style={{ color: crossfadeValue > 0 ? 'var(--mc-accent-primary)' : 'var(--mc-text-muted)' }} />
                <span className="text-xs" style={{ color: 'var(--mc-text-secondary)' }}>Crossfade</span>
              </div>
              <span className="text-xs font-medium tabular-nums" style={{ color: 'var(--mc-text-primary)' }}>
                {crossfadeValue === 0 ? 'Off' : `${crossfadeValue}s`}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={12}
              step={1}
              value={crossfadeValue}
              onChange={handleCrossfadeChange}
              aria-label="Crossfade duration"
              aria-valuetext={crossfadeValue === 0 ? 'Off' : `${crossfadeValue} seconds`}
              className="w-full h-1 rounded-full appearance-none cursor-pointer
                focus-visible:outline-none focus-visible:ring-2"
              style={{
                backgroundColor: 'var(--mc-waveform-buffered)',
                accentColor: 'var(--mc-accent-primary)',
                ['--tw-ring-color' as string]: 'var(--mc-accent-primary)',
              }}
            />
            <div className="flex justify-between mt-0.5">
              <span className="text-[10px]" style={{ color: 'var(--mc-text-muted)' }}>0s</span>
              <span className="text-[10px]" style={{ color: 'var(--mc-text-muted)' }}>12s</span>
            </div>
          </div>

          <div className="mx-2" style={{ borderTop: '1px solid var(--mc-waveform-buffered)' }} />

          <div className="p-1.5">
            <div
              className="flex items-center justify-between rounded px-2 py-1.5 transition-colors mc-hover-surface"
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal
                  className="w-3.5 h-3.5"
                  style={{ color: eqEnabled ? 'var(--mc-accent-primary)' : 'var(--mc-text-muted)' }}
                />
                <span className="text-xs" style={{ color: 'var(--mc-text-secondary)' }}>Equalizer</span>
              </div>
              <div className="flex items-center gap-2">
                <ToggleSwitch active={eqEnabled} onClick={handleToggleEq} label="Toggle equalizer" />
                <button
                  onClick={handleOpenEq}
                  className="mc-interactive-muted transition-colors"
                  aria-label="Equalizer settings"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ToggleSwitch({ active, onClick, label }: { active: boolean; onClick: (e: React.MouseEvent) => void; label: string }) {
  return (
    <button
      onClick={onClick}
      role="switch"
      aria-checked={active}
      aria-label={label}
      className="w-7 h-3.5 rounded-full transition-colors relative shrink-0
        focus-visible:outline-none focus-visible:ring-2"
      style={{
        backgroundColor: active ? 'var(--mc-accent-primary-hover)' : 'var(--mc-scrollbar-thumb-hover)',
        ['--tw-ring-color' as string]: 'var(--mc-accent-primary)',
      }}
    >
      <span
        className={`absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white transition-transform ${active ? 'left-3.5' : 'left-0.5'}`}
      />
    </button>
  );
}

function ToggleRow({ icon: Icon, label, active, onClick }: { icon: LucideIcon; label: string; active: boolean; onClick: () => void }) {
  return (
    <div
      className="flex items-center justify-between rounded px-2 py-1.5 cursor-pointer transition-colors mc-hover-surface"
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5" style={{ color: active ? 'var(--mc-accent-primary)' : 'var(--mc-text-muted)' }} />
        <span className="text-xs" style={{ color: 'var(--mc-text-secondary)' }}>{label}</span>
      </div>
      <ToggleSwitch active={active} onClick={(e) => { e.stopPropagation(); onClick(); }} label={`Toggle ${label.toLowerCase()}`} />
    </div>
  );
}

function ActionRow({ icon: Icon, label, onClick, warning }: { icon: LucideIcon; label: string; onClick: () => void; warning?: boolean }) {
  return (
    <div
      className="flex items-center justify-between rounded px-2 py-1.5 cursor-pointer transition-colors mc-hover-surface"
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5" style={{ color: warning ? 'var(--mc-text-warning)' : 'var(--mc-text-muted)' }} />
        <span className="text-xs" style={{ color: 'var(--mc-text-secondary)' }}>{label}</span>
      </div>
      <ChevronRight className="w-3.5 h-3.5" style={{ color: 'var(--mc-text-muted)' }} />
    </div>
  );
}
