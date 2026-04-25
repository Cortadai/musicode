import { memo } from 'react';
import type { DeckThemeId } from './DeckThemeToggle';

interface Props {
  isPlaying: boolean;
  hasPrev: boolean;
  hasNext: boolean;
  onPlayPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  onStop: () => void;
  theme: DeckThemeId;
}

function DeckButton({
  children,
  onClick,
  disabled = false,
  active = false,
  wide = false,
  ariaLabel,
  theme = 'classic' as DeckThemeId,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  wide?: boolean;
  ariaLabel: string;
  theme?: DeckThemeId;
}) {
  const synth = theme === 'synthwave';
  const ind = theme === 'indigo';

  const bgActive = synth
    ? 'linear-gradient(180deg, #2a1855 0%, #1a1040 50%, #140c30 100%)'
    : ind
      ? 'linear-gradient(180deg, #312e81 0%, #1e1b4b 50%, #171538 100%)'
      : 'linear-gradient(180deg, #4a4a4a 0%, #2e2e2e 50%, #252525 100%)';
  const bgIdle = synth
    ? 'linear-gradient(180deg, #201248 0%, #160e38 50%, #100a28 100%)'
    : ind
      ? 'linear-gradient(180deg, #252370 0%, #1a185a 50%, #121045 100%)'
      : 'linear-gradient(180deg, #404040 0%, #2a2a2a 50%, #1e1e1e 100%)';
  const borderC = synth ? '#4c1d95' : ind ? '#3730a3' : '#555';
  const borderTop = synth ? '#6d28d9' : ind ? '#4f46e5' : '#666';
  const borderBot = synth ? '#0a0420' : ind ? '#080618' : '#0a0a0a';
  const shadowActive = synth
    ? 'inset 0 2px 4px rgba(88,28,135,0.5), 0 1px 0 rgba(139,92,246,0.05)'
    : ind
      ? 'inset 0 2px 4px rgba(49,46,129,0.5), 0 1px 0 rgba(99,102,241,0.05)'
      : 'inset 0 2px 4px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.03)';
  const shadowIdle = synth
    ? '0 3px 6px rgba(88,28,135,0.3), inset 0 1px 0 rgba(139,92,246,0.1), 0 1px 0 rgba(139,92,246,0.03)'
    : ind
      ? '0 3px 6px rgba(49,46,129,0.3), inset 0 1px 0 rgba(99,102,241,0.1), 0 1px 0 rgba(99,102,241,0.03)'
      : '0 3px 6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08), 0 1px 0 rgba(255,255,255,0.03)';
  const colorActive = synth ? '#e9d5ff' : ind ? '#e0e7ff' : '#f0e6d3';
  const colorIdle = synth ? '#a78bfa' : ind ? '#818cf8' : '#aaa';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        relative flex items-center justify-center
        ${wide ? 'px-6 min-w-[80px]' : 'px-4 min-w-[52px]'}
        h-10 rounded-[3px]
        font-mono text-[11px] font-bold tracking-wider uppercase
        transition-all duration-75
        ${disabled
          ? 'opacity-30 cursor-not-allowed'
          : 'active:translate-y-0.5 active:shadow-none cursor-pointer hover:brightness-110'
        }
      `}
      style={{
        background: active ? bgActive : bgIdle,
        border: `1px solid ${borderC}`,
        borderTop: `1px solid ${borderTop}`,
        borderBottom: `2px solid ${borderBot}`,
        boxShadow: active ? shadowActive : shadowIdle,
        color: active ? colorActive : colorIdle,
      }}
    >
      {children}
    </button>
  );
}

function DeckTransport({ isPlaying, hasPrev, hasNext, onPlayPause, onPrev, onNext, onStop, theme }: Props) {
  return (
    <div className="flex items-center gap-2">
      <DeckButton onClick={onPrev} disabled={!hasPrev} ariaLabel="Previous track" theme={theme}>
        <span className="text-[13px]">◀◀</span>
      </DeckButton>
      <DeckButton onClick={onPlayPause} active={isPlaying} wide ariaLabel={isPlaying ? 'Pause' : 'Play'} theme={theme}>
        <span className="text-[15px]">{isPlaying ? '❚❚' : '▶'}</span>
      </DeckButton>
      <DeckButton onClick={onStop} ariaLabel="Stop" theme={theme}>
        <span className="text-[14px]">■</span>
      </DeckButton>
      <DeckButton onClick={onNext} disabled={!hasNext} ariaLabel="Next track" theme={theme}>
        <span className="text-[13px]">▶▶</span>
      </DeckButton>
    </div>
  );
}

export default memo(DeckTransport);
