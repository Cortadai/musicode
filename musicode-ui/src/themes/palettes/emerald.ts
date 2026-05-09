import type { PaletteConfig } from '../types';

export const emeraldPalette: PaletteConfig = {
  name: 'emerald',
  label: 'Aurora',
  tokens: {
    // Backgrounds — subtle green tint
    bgBase: '#070b09',
    bgSurface: '#121a16',
    bgSurfaceHover: '#1a2820',
    bgElevated: '#161e1a',
    bgOverlay: 'rgba(0, 0, 0, 0.65)',

    // Borders
    borderDefault: '#1a2820',
    borderSubtle: '#152018',
    borderAccent: '#10b981',

    // Text
    textPrimary: '#f0f5f2',
    textSecondary: '#9eaaa3',
    textMuted: '#6b7a72',
    textInverse: '#070b09',

    // Accent — emerald
    accentPrimary: '#34d399',
    accentPrimaryHover: '#10b981',
    accentPrimaryMuted: 'rgba(52, 211, 153, 0.2)',
    accentSecondary: '#2dd4bf',

    // Glassmorphism colors
    glassBackground: 'rgba(200, 255, 230, 0.04)',
    glassBorder: 'rgba(200, 255, 230, 0.10)',

    // Player
    playerBackground: '#121a16',
    playerBorder: '#1a2820',
    waveformPlayed: '#34d399',
    waveformBuffered: '#2a3d32',
    waveformPending: '#1a2820',

    // Sidebar
    sidebarBackground: '#070b09',
    sidebarBorder: '#1a2820',
    sidebarActiveBackground: 'rgba(52, 211, 153, 0.15)',
    sidebarActiveText: '#34d399',
    sidebarMutedText: '#6b7a72',

    // Status
    textError: '#f87171',
    textWarning: '#fbbf24',
    textSuccess: '#4ade80',
    textInfo: '#60a5fa',

    // Analyzer Deck
    deckBg: 'rgba(7, 11, 9, 0.92)',
    deckBorder: '#1a2820',
    deckLabel: 'rgba(52, 211, 153, 0.35)',
    scopeGrid: 'rgba(52, 211, 153, 0.08)',
    scopeLine: '#10b981',

    // Misc
    scrollbarThumb: '#2a3d32',
    scrollbarThumbHover: '#3a5245',
    badgeBackground: 'rgba(52, 211, 153, 0.2)',
    badgeText: '#34d399',
    deckHandle: '#34d399',
  },
};
