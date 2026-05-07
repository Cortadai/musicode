import type { ThemeConfig } from '../types';

export const novatouchTheme: ThemeConfig = {
  name: 'novatouch',
  label: 'Novatouch',
  layout: 'sidebar-icons',
  tokens: {
    // Backgrounds — darker, cooler
    bgBase: '#07070a',
    bgSurface: '#12121a',
    bgSurfaceHover: '#1a1a28',
    bgElevated: '#161620',
    bgOverlay: 'rgba(0, 0, 0, 0.7)',

    // Borders — cooler tint
    borderDefault: '#1e1e2e',
    borderSubtle: '#15151f',
    borderAccent: '#6366f1',     // indigo-500

    // Text
    textPrimary: '#e4e4e7',      // zinc-200
    textSecondary: '#a1a1aa',    // zinc-400
    textMuted: '#63637a',
    textInverse: '#07070a',

    // Accent — indigo (shared palette)
    accentPrimary: '#818cf8',    // indigo-400
    accentPrimaryHover: '#6366f1', // indigo-500
    accentPrimaryMuted: 'rgba(99, 102, 241, 0.2)',
    accentSecondary: '#a78bfa',  // violet-400

    // Glassmorphism — disabled (solid look)
    glassBackground: '#12121a',
    glassBorder: '#1e1e2e',
    glassBlur: '0px',

    // Player
    playerBackground: '#12121a',
    playerBorder: '#1e1e2e',
    waveformPlayed: '#818cf8',
    waveformBuffered: '#2e2e40',
    waveformPending: '#1a1a28',

    // Sidebar — icon-only, more compact
    sidebarBackground: '#0a0a10',
    sidebarBorder: '#1e1e2e',
    sidebarActiveBackground: 'rgba(99, 102, 241, 0.15)',
    sidebarActiveText: '#818cf8',
    sidebarMutedText: '#63637a',

    // Status
    textError: '#f87171',        // red-400
    textWarning: '#fbbf24',      // amber-400
    textSuccess: '#4ade80',      // green-400
    textInfo: '#60a5fa',          // blue-400

    // Analyzer Deck — deep technical feel
    deckBg: 'rgba(6, 6, 16, 0.92)',
    deckBorder: '#1e1e2e',
    deckLabel: 'rgba(129, 140, 248, 0.35)',
    scopeGrid: 'rgba(129, 140, 248, 0.08)',
    scopeLine: '#4834d4',

    // Misc
    scrollbarThumb: '#2e2e40',
    scrollbarThumbHover: '#3d3d55',
    badgeBackground: 'rgba(99, 102, 241, 0.2)',
    badgeText: '#818cf8',

    // Typography
    fontBody: "'Inter', system-ui, -apple-system, sans-serif",
    fontMono: "'JetBrains Mono', 'Fira Code', monospace",

    // Spacing / Radius
    radiusSm: '4px',
    radiusMd: '8px',
    radiusLg: '12px',
    radiusXl: '16px',
  },
};
