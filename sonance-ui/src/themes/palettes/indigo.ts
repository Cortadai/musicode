import type { PaletteConfig } from '../types';

export const indigoPalette: PaletteConfig = {
  name: 'indigo',
  label: 'Midnight',
  tokens: {
    // Backgrounds — darker, cooler blue tint
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

    // Accent — indigo
    accentPrimary: '#818cf8',    // indigo-400
    accentPrimaryHover: '#6366f1', // indigo-500
    accentPrimaryMuted: 'rgba(99, 102, 241, 0.2)',
    accentSecondary: '#a78bfa',  // violet-400

    // Glassmorphism colors
    glassBackground: '#12121a',
    glassBorder: '#1e1e2e',

    // Player
    playerBackground: '#12121a',
    playerBorder: '#1e1e2e',
    waveformPlayed: '#818cf8',
    waveformBuffered: '#2e2e40',
    waveformPending: '#1a1a28',

    // Sidebar
    sidebarBackground: '#0a0a10',
    sidebarBorder: '#1e1e2e',
    sidebarActiveBackground: 'rgba(99, 102, 241, 0.15)',
    sidebarActiveText: '#818cf8',
    sidebarMutedText: '#63637a',

    // Status
    textError: '#f87171',        // red-400
    textWarning: '#fbbf24',      // amber-400
    textSuccess: '#4ade80',      // green-400
    textInfo: '#818cf8',          // indigo-400

    // Analyzer Deck — deep technical feel
    deckBg: 'rgba(6, 6, 16, 0.92)',
    deckBorder: '#1e1e2e',
    deckLabel: 'rgba(129, 140, 248, 0.35)',
    scopeGrid: 'rgba(129, 140, 248, 0.08)',
    scopeLine: '#6366f1',

    // Misc
    scrollbarThumb: '#2e2e40',
    scrollbarThumbHover: '#3d3d55',
    badgeBackground: 'rgba(99, 102, 241, 0.2)',
    badgeText: '#818cf8',
    deckHandle: '#4834d4',
  },
};
