import type { PaletteConfig } from '../types';

export const zincPalette: PaletteConfig = {
  name: 'zinc',
  label: 'Zinc',
  swatch: '#a1a1aa',
  tokens: {
    // Backgrounds — zinc scale
    bgBase: '#09090b',           // zinc-950
    bgSurface: '#18181b',        // zinc-900
    bgSurfaceHover: '#27272a',   // zinc-800
    bgElevated: '#1c1c1f',       // between zinc-900 and 800
    bgOverlay: 'rgba(0, 0, 0, 0.6)',

    // Borders
    borderDefault: '#27272a',    // zinc-800
    borderSubtle: '#1f1f23',     // between zinc-900 and 800
    borderAccent: '#6366f1',     // indigo-500

    // Text
    textPrimary: '#f4f4f5',      // zinc-100
    textSecondary: '#a1a1aa',    // zinc-400
    textMuted: '#71717a',        // zinc-500
    textInverse: '#09090b',      // zinc-950

    // Accent — indigo
    accentPrimary: '#818cf8',    // indigo-400
    accentPrimaryHover: '#6366f1', // indigo-500
    accentPrimaryMuted: 'rgba(99, 102, 241, 0.2)',
    accentSecondary: '#a78bfa',  // violet-400

    // Glassmorphism colors
    glassBackground: 'rgba(255, 255, 255, 0.04)',
    glassBorder: 'rgba(255, 255, 255, 0.10)',

    // Player
    playerBackground: '#18181b', // zinc-900
    playerBorder: '#27272a',     // zinc-800
    waveformPlayed: '#818cf8',   // indigo-400
    waveformBuffered: '#3f3f46', // zinc-700
    waveformPending: '#27272a',  // zinc-800

    // Sidebar
    sidebarBackground: '#09090b', // zinc-950
    sidebarBorder: '#27272a',     // zinc-800
    sidebarActiveBackground: '#27272a', // zinc-800
    sidebarActiveText: '#ffffff',
    sidebarMutedText: '#71717a', // zinc-500

    // Status
    textError: '#f87171',        // red-400
    textWarning: '#fbbf24',      // amber-400
    textSuccess: '#4ade80',      // green-400
    textInfo: '#60a5fa',          // blue-400

    // Analyzer Deck
    deckBg: 'rgba(9, 9, 11, 0.9)',
    deckBorder: '#27272a',
    deckLabel: 'rgba(161, 161, 170, 0.35)',
    scopeGrid: 'rgba(255, 255, 255, 0.06)',
    scopeLine: '#4834d4',

    // Misc
    scrollbarThumb: '#3f3f46',   // zinc-700
    scrollbarThumbHover: '#52525b', // zinc-600
    badgeBackground: 'rgba(99, 102, 241, 0.2)',
    badgeText: '#818cf8',        // indigo-400
    deckHandle: '#818cf8',
  },
};
