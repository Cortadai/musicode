import { useMemo } from 'react';
import type { DeckThemeId } from './DeckThemeToggle';

interface Props {
  seconds: number;
  theme: DeckThemeId;
}

export default function Odometer({ seconds, theme }: Props) {
  const synth = theme === 'synthwave';
  const ind = theme === 'indigo';
  const digits = useMemo(() => {
    const clamped = Math.max(0, Math.min(seconds, 5999));
    const m = Math.floor(clamped / 60);
    const s = Math.floor(clamped % 60);
    return [
      Math.floor(m / 10),
      m % 10,
      Math.floor(s / 10),
      s % 10,
    ];
  }, [seconds]);

  const cellBg = synth ? '#0c0620' : ind ? '#0c1025' : '#0a0a0a';
  const cellBorder = synth ? '#2d1f5e' : ind ? '#312e81' : '#333';
  const cellShadow = synth
    ? 'inset 0 1px 3px rgba(88,28,135,0.5)'
    : ind
      ? 'inset 0 1px 3px rgba(49,46,129,0.5)'
      : 'inset 0 1px 3px rgba(0,0,0,0.8)';
  const digitColor = synth ? '#c084fc' : ind ? '#a5b4fc' : '#e8e0d0';
  const digitGlow = synth
    ? '0 0 6px rgba(192,132,252,0.6)'
    : ind
      ? '0 0 6px rgba(165,180,252,0.5)'
      : '0 0 3px rgba(232,224,208,0.25)';

  return (
    <div className="flex items-center gap-0.5" aria-label={`Counter: ${digits[0]}${digits[1]}:${digits[2]}${digits[3]}`}>
      {digits.map((d, i) => (
        <div key={i} className="relative flex flex-col items-center">
          <div
            className="w-[20px] h-[26px] rounded-sm flex items-center justify-center overflow-hidden"
            style={{ background: cellBg, border: `1px solid ${cellBorder}`, boxShadow: cellShadow }}
          >
            <span
              className="font-mono text-sm font-bold leading-none select-none"
              style={{ color: digitColor, textShadow: digitGlow }}
            >
              {d}
            </span>
          </div>
          <div
            className="absolute top-1/2 left-0 right-0 h-px"
            style={{ background: 'rgba(0,0,0,0.6)' }}
          />
          {i === 1 && (
            <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-mono select-none">
              :
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
