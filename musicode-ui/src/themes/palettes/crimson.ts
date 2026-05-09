import type { PaletteConfig } from '../types';

export const crimsonPalette: PaletteConfig = {
  name: 'crimson',
  label: 'Ember',
  tokens: {
    // Backgrounds — warm-neutral dark
    bgBase: '#0b0909',
    bgSurface: '#1b1818',
    bgSurfaceHover: '#2a2525',
    bgElevated: '#1f1c1c',
    bgOverlay: 'rgba(0, 0, 0, 0.65)',

    // Borders
    borderDefault: '#2a2525',
    borderSubtle: '#211d1d',
    borderAccent: '#c2556a',

    // Text
    textPrimary: '#f5f0f0',
    textSecondary: '#a8a0a0',
    textMuted: '#786e6e',
    textInverse: '#0b0909',

    // Accent — rose/coral, softer than pure red
    accentPrimary: '#e06b7d',
    accentPrimaryHover: '#c2556a',
    accentPrimaryMuted: 'rgba(224, 107, 125, 0.2)',
    accentSecondary: '#f0a07a',

    // Glassmorphism colors
    glassBackground: 'rgba(255, 240, 240, 0.04)',
    glassBorder: 'rgba(255, 240, 240, 0.10)',

    // Player
    playerBackground: '#1b1818',
    playerBorder: '#2a2525',
    waveformPlayed: '#e06b7d',
    waveformBuffered: '#3d3535',
    waveformPending: '#2a2525',

    // Sidebar
    sidebarBackground: '#0b0909',
    sidebarBorder: '#2a2525',
    sidebarActiveBackground: 'rgba(224, 107, 125, 0.15)',
    sidebarActiveText: '#e06b7d',
    sidebarMutedText: '#786e6e',

    // Status
    textError: '#f87171',
    textWarning: '#fbbf24',
    textSuccess: '#4ade80',
    textInfo: '#60a5fa',

    // Analyzer Deck
    deckBg: 'rgba(11, 9, 9, 0.92)',
    deckBorder: '#2a2525',
    deckLabel: 'rgba(224, 107, 125, 0.35)',
    scopeGrid: 'rgba(224, 107, 125, 0.08)',
    scopeLine: '#c2556a',

    // Misc
    scrollbarThumb: '#3d3535',
    scrollbarThumbHover: '#524848',
    badgeBackground: 'rgba(224, 107, 125, 0.2)',
    badgeText: '#e06b7d',
    deckHandle: '#e06b7d',
  },
};
