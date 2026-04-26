import { memo } from 'react';
import type { DeckThemeId } from './DeckThemeToggle';

interface Props {
  isPlaying: boolean;
  theme: DeckThemeId;
}

function LED({ label, color, active, theme }: { label: string; color: string; active: boolean; theme: DeckThemeId }) {
  const synth = theme === 'synthwave';
  const ind = theme === 'indigo';
  const inactiveBg = synth ? '#2a1850' : ind ? '#27272a' : '#333';
  const borderColor = synth ? 'rgba(139,92,246,0.25)' : ind ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.08)';
  const inactiveGlow = synth ? 'rgba(139,92,246,0.1)' : ind ? 'rgba(99,102,241,0.08)' : 'rgba(0,0,0,0)';
  const activeLabel = synth ? '#d8b4fe' : ind ? '#c7d2fe' : '#c8c0b0';
  const inactiveLabel = synth ? '#5b4590' : ind ? '#52525b' : '#555';

  return (
    <div className="flex items-center gap-1.5">
      <div
        className="w-2.5 h-2.5 rounded-full transition-all duration-300"
        style={{
          background: active ? color : inactiveBg,
          border: `1px solid ${borderColor}`,
          boxShadow: active
            ? `0 0 4px ${color}, 0 0 10px ${color}50, inset 0 0 2px rgba(255,255,255,0.3)`
            : `inset 0 1px 2px rgba(0,0,0,0.6), 0 0 2px ${inactiveGlow}`,
        }}
      />
      <span
        className="font-mono text-[9px] font-bold tracking-[0.15em] uppercase select-none"
        style={{ color: active ? activeLabel : inactiveLabel }}
      >
        {label}
      </span>
    </div>
  );
}

function DeckLEDs({ isPlaying, theme }: Props) {
  const synth = theme === 'synthwave';
  const ind = theme === 'indigo';
  const stereoColor = synth ? '#22d3ee' : ind ? '#818cf8' : '#4ade80';
  const playColor = synth ? '#f0abfc' : ind ? '#a5b4fc' : '#facc15';
  const dolbyColor = synth ? '#22d3ee' : ind ? '#818cf8' : '#d97706';

  return (
    <div className="flex items-center gap-4">
      <LED label="STEREO" color={stereoColor} active theme={theme} />
      <LED label="PLAY" color={playColor} active={isPlaying} theme={theme} />
      <LED label="DOLBY NR" color={dolbyColor} active={isPlaying} theme={theme} />
    </div>
  );
}

export default memo(DeckLEDs);
