import type { PaletteConfig } from '../types';

export const daylightPalette: PaletteConfig = {
  name: 'daylight',
  label: 'Daylight',
  tokens: {
    // Backgrounds — clean white/zinc
    bgBase: '#fafafa',           // zinc-50
    bgSurface: '#ffffff',        // white
    bgSurfaceHover: '#f4f4f5',   // zinc-100
    bgElevated: '#ffffff',
    bgOverlay: 'rgba(0, 0, 0, 0.3)',

    // Borders
    borderDefault: '#e4e4e7',    // zinc-200
    borderSubtle: '#f4f4f5',     // zinc-100
    borderAccent: '#6366f1',     // indigo-500

    // Text
    textPrimary: '#18181b',      // zinc-900
    textSecondary: '#52525b',    // zinc-600
    textMuted: '#a1a1aa',        // zinc-400
    textInverse: '#fafafa',      // zinc-50

    // Accent — indigo (darker for light bg contrast)
    accentPrimary: '#6366f1',    // indigo-500
    accentPrimaryHover: '#4f46e5', // indigo-600
    accentPrimaryMuted: 'rgba(99, 102, 241, 0.12)',
    accentSecondary: '#8b5cf6',  // violet-500

    // Glassmorphism colors
    glassBackground: 'rgba(255, 255, 255, 0.7)',
    glassBorder: 'rgba(0, 0, 0, 0.08)',

    // Player
    playerBackground: '#ffffff',
    playerBorder: '#e4e4e7',     // zinc-200
    waveformPlayed: '#6366f1',   // indigo-500
    waveformBuffered: '#d4d4d8', // zinc-300
    waveformPending: '#e4e4e7',  // zinc-200

    // Sidebar
    sidebarBackground: '#f4f4f5', // zinc-100
    sidebarBorder: '#e4e4e7',     // zinc-200
    sidebarActiveBackground: 'rgba(99, 102, 241, 0.1)',
    sidebarActiveText: '#4f46e5', // indigo-600
    sidebarMutedText: '#71717a',  // zinc-500

    // Status — darker for light bg
    textError: '#dc2626',        // red-600
    textWarning: '#d97706',      // amber-600
    textSuccess: '#16a34a',      // green-600
    textInfo: '#2563eb',         // blue-600

    // Analyzer Deck
    deckBg: 'rgba(250, 250, 250, 0.95)',
    deckBorder: '#e4e4e7',
    deckLabel: 'rgba(82, 82, 91, 0.4)',
    scopeGrid: 'rgba(0, 0, 0, 0.06)',
    scopeLine: '#6366f1',

    // Misc
    scrollbarThumb: '#d4d4d8',   // zinc-300
    scrollbarThumbHover: '#a1a1aa', // zinc-400
    badgeBackground: 'rgba(99, 102, 241, 0.12)',
    badgeText: '#4f46e5',        // indigo-600
    deckHandle: '#6366f1',
  },
};
