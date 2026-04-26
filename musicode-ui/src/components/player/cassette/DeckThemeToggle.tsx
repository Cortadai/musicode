import { memo } from 'react';

export type DeckThemeId = 'classic' | 'indigo' | 'synthwave';

const THEME_ORDER: DeckThemeId[] = ['classic', 'indigo', 'synthwave'];
const THEME_LABELS: Record<DeckThemeId, string> = { classic: 'CLASSIC', indigo: 'INDIGO', synthwave: 'SYNTH' };

const THEME_STYLES: Record<DeckThemeId, { bg: string; border: string; track: string; trackShadow: string; thumb: string; thumbPos: string; thumbShadow: string; label: string }> = {
  classic: {
    bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)',
    track: '#333', trackShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)',
    thumb: '#888', thumbPos: '2px', thumbShadow: 'none', label: '#555',
  },
  indigo: {
    bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.3)',
    track: 'linear-gradient(90deg, #3f3f46, #6366f1)', trackShadow: '0 0 6px rgba(99,102,241,0.35)',
    thumb: '#e4e4e7', thumbPos: '8px', thumbShadow: '0 0 4px rgba(228,228,231,0.4)', label: '#818cf8',
  },
  synthwave: {
    bg: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(236,72,153,0.2))', border: 'rgba(139,92,246,0.4)',
    track: 'linear-gradient(90deg, #8b5cf6, #ec4899)', trackShadow: '0 0 6px rgba(139,92,246,0.5)',
    thumb: '#fff', thumbPos: '14px', thumbShadow: '0 0 4px rgba(255,255,255,0.6)', label: '#c084fc',
  },
};

interface Props {
  theme: DeckThemeId;
  onToggle: () => void;
}

function DeckThemeToggle({ theme, onToggle }: Props) {
  const nextTheme = THEME_ORDER[(THEME_ORDER.indexOf(theme) + 1) % THEME_ORDER.length];
  const s = THEME_STYLES[theme];

  return (
    <button
      onClick={onToggle}
      aria-label={`Switch to ${nextTheme} theme`}
      className="flex items-center gap-1.5 w-[88px] px-2.5 py-1.5 rounded transition-all duration-200 hover:brightness-125"
      style={{ background: s.bg, border: `1px solid ${s.border}` }}
    >
      <div
        className="w-6 h-3 rounded-full relative flex-shrink-0 transition-all duration-200"
        style={{ background: s.track, boxShadow: s.trackShadow }}
      >
        <div
          className="absolute top-0.5 w-2 h-2 rounded-full transition-all duration-200"
          style={{ left: s.thumbPos, background: s.thumb, boxShadow: s.thumbShadow }}
        />
      </div>
      <span
        className="font-mono text-[9px] font-bold tracking-[0.15em] uppercase select-none"
        style={{ color: s.label }}
      >
        {THEME_LABELS[theme]}
      </span>
    </button>
  );
}

export default memo(DeckThemeToggle);
