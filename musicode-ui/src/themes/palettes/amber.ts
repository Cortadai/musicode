import type { PaletteConfig } from '../types';

export const amberPalette: PaletteConfig = {
  name: 'amber',
  label: 'Bonfire',
  tokens: {
    // Backgrounds — warm dark (inspired by Astra Studio)
    bgBase: '#0a0908',
    bgSurface: '#1a1816',
    bgSurfaceHover: '#28251f',
    bgElevated: '#1e1c18',
    bgOverlay: 'rgba(0, 0, 0, 0.65)',

    // Borders
    borderDefault: '#28251f',
    borderSubtle: '#201d18',
    borderAccent: '#f59e0b',

    // Text
    textPrimary: '#f5f3f0',
    textSecondary: '#aaa598',
    textMuted: '#7a7568',
    textInverse: '#0a0908',

    // Accent — amber
    accentPrimary: '#fbbf24',
    accentPrimaryHover: '#f59e0b',
    accentPrimaryMuted: 'rgba(251, 191, 36, 0.2)',
    accentSecondary: '#fb923c',

    // Glassmorphism colors
    glassBackground: 'rgba(255, 240, 200, 0.04)',
    glassBorder: 'rgba(255, 240, 200, 0.10)',

    // Player
    playerBackground: '#1a1816',
    playerBorder: '#28251f',
    waveformPlayed: '#fbbf24',
    waveformBuffered: '#3d3828',
    waveformPending: '#28251f',

    // Sidebar
    sidebarBackground: '#0a0908',
    sidebarBorder: '#28251f',
    sidebarActiveBackground: 'rgba(251, 191, 36, 0.15)',
    sidebarActiveText: '#fbbf24',
    sidebarMutedText: '#7a7568',

    // Status
    textError: '#f87171',
    textWarning: '#fbbf24',
    textSuccess: '#4ade80',
    textInfo: '#60a5fa',

    // Analyzer Deck
    deckBg: 'rgba(10, 9, 8, 0.92)',
    deckBorder: '#28251f',
    deckLabel: 'rgba(251, 191, 36, 0.35)',
    scopeGrid: 'rgba(251, 191, 36, 0.08)',
    scopeLine: '#f59e0b',

    // Misc
    scrollbarThumb: '#3d3828',
    scrollbarThumbHover: '#524a38',
    badgeBackground: 'rgba(251, 191, 36, 0.2)',
    badgeText: '#fbbf24',
    deckHandle: '#fbbf24',
  },
};
