import type { PaletteConfig } from '../types';

export const cyanPalette: PaletteConfig = {
  name: 'cyan',
  label: 'Stardust',
  tokens: {
    // Backgrounds — cool slate (inspired by Astra Default/Graphite)
    bgBase: '#080a0c',
    bgSurface: '#121820',
    bgSurfaceHover: '#1a2430',
    bgElevated: '#161c26',
    bgOverlay: 'rgba(0, 0, 0, 0.65)',

    // Borders
    borderDefault: '#1a2430',
    borderSubtle: '#151d28',
    borderAccent: '#06b6d4',

    // Text
    textPrimary: '#f0f4f8',
    textSecondary: '#9eaabc',
    textMuted: '#6b7a92',
    textInverse: '#080a0c',

    // Accent — cyan
    accentPrimary: '#22d3ee',
    accentPrimaryHover: '#06b6d4',
    accentPrimaryMuted: 'rgba(34, 211, 238, 0.2)',
    accentSecondary: '#38bdf8',

    // Glassmorphism colors
    glassBackground: 'rgba(200, 240, 255, 0.04)',
    glassBorder: 'rgba(200, 240, 255, 0.10)',

    // Player
    playerBackground: '#121820',
    playerBorder: '#1a2430',
    waveformPlayed: '#22d3ee',
    waveformBuffered: '#283848',
    waveformPending: '#1a2430',

    // Sidebar
    sidebarBackground: '#080a0c',
    sidebarBorder: '#1a2430',
    sidebarActiveBackground: 'rgba(34, 211, 238, 0.15)',
    sidebarActiveText: '#22d3ee',
    sidebarMutedText: '#6b7a92',

    // Status
    textError: '#f87171',
    textWarning: '#fbbf24',
    textSuccess: '#4ade80',
    textInfo: '#60a5fa',

    // Analyzer Deck
    deckBg: 'rgba(8, 10, 12, 0.92)',
    deckBorder: '#1a2430',
    deckLabel: 'rgba(34, 211, 238, 0.35)',
    scopeGrid: 'rgba(34, 211, 238, 0.08)',
    scopeLine: '#06b6d4',

    // Misc
    scrollbarThumb: '#283848',
    scrollbarThumbHover: '#384d62',
    badgeBackground: 'rgba(34, 211, 238, 0.2)',
    badgeText: '#22d3ee',
    deckHandle: '#22d3ee',
  },
};
