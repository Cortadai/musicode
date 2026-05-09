import type { PaletteConfig } from '../types';

export const sunrisePalette: PaletteConfig = {
  name: 'sunrise',
  label: 'Sunrise',
  tokens: {
    // Backgrounds — warm cream/ivory
    bgBase: '#faf8f5',
    bgSurface: '#fffefa',
    bgSurfaceHover: '#f5f0e8',
    bgElevated: '#fffefa',
    bgOverlay: 'rgba(0, 0, 0, 0.3)',

    // Borders — warm tint
    borderDefault: '#e8e0d4',
    borderSubtle: '#f0ebe2',
    borderAccent: '#d97706',     // amber-600

    // Text
    textPrimary: '#1c1917',      // stone-900
    textSecondary: '#57534e',    // stone-600
    textMuted: '#a8a29e',        // stone-400
    textInverse: '#faf8f5',

    // Accent — amber (warm, readable on cream)
    accentPrimary: '#d97706',    // amber-600
    accentPrimaryHover: '#b45309', // amber-700
    accentPrimaryMuted: 'rgba(217, 119, 6, 0.12)',
    accentSecondary: '#ea580c',  // orange-600

    // Glassmorphism colors
    glassBackground: 'rgba(255, 254, 250, 0.7)',
    glassBorder: 'rgba(0, 0, 0, 0.06)',

    // Player
    playerBackground: '#fffefa',
    playerBorder: '#e8e0d4',
    waveformPlayed: '#d97706',   // amber-600
    waveformBuffered: '#d6d3d1', // stone-300
    waveformPending: '#e7e5e4',  // stone-200

    // Sidebar
    sidebarBackground: '#f5f0e8',
    sidebarBorder: '#e8e0d4',
    sidebarActiveBackground: 'rgba(217, 119, 6, 0.1)',
    sidebarActiveText: '#b45309', // amber-700
    sidebarMutedText: '#78716c', // stone-500

    // Status — darker for light bg
    textError: '#dc2626',        // red-600
    textWarning: '#d97706',      // amber-600
    textSuccess: '#16a34a',      // green-600
    textInfo: '#2563eb',         // blue-600

    // Analyzer Deck
    deckBg: 'rgba(250, 248, 245, 0.95)',
    deckBorder: '#e8e0d4',
    deckLabel: 'rgba(87, 83, 78, 0.4)',
    scopeGrid: 'rgba(0, 0, 0, 0.06)',
    scopeLine: '#d97706',

    // Misc
    scrollbarThumb: '#d6d3d1',   // stone-300
    scrollbarThumbHover: '#a8a29e', // stone-400
    badgeBackground: 'rgba(217, 119, 6, 0.12)',
    badgeText: '#b45309',        // amber-700
    deckHandle: '#d97706',
  },
};
