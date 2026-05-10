import type { PaletteConfig } from '../types';

export const frostPalette: PaletteConfig = {
  name: 'frost',
  label: 'Frost',
  tokens: {
    // Backgrounds — cool blue-gray
    bgBase: '#f8fafc',           // slate-50
    bgSurface: '#ffffff',
    bgSurfaceHover: '#f1f5f9',   // slate-100
    bgElevated: '#ffffff',
    bgOverlay: 'rgba(0, 0, 0, 0.3)',

    // Borders — cool tint
    borderDefault: '#e2e8f0',    // slate-200
    borderSubtle: '#f1f5f9',     // slate-100
    borderAccent: '#0284c7',     // sky-600

    // Text
    textPrimary: '#0f172a',      // slate-900
    textSecondary: '#475569',    // slate-600
    textMuted: '#94a3b8',        // slate-400
    textInverse: '#f8fafc',      // slate-50

    // Accent — sky blue (cool, professional)
    accentPrimary: '#0284c7',    // sky-600
    accentPrimaryHover: '#0369a1', // sky-700
    accentPrimaryMuted: 'rgba(2, 132, 199, 0.12)',
    accentSecondary: '#0891b2',  // cyan-600

    // Glassmorphism colors
    glassBackground: 'rgba(255, 255, 255, 0.7)',
    glassBorder: 'rgba(0, 0, 0, 0.06)',

    // Player
    playerBackground: '#ffffff',
    playerBorder: '#e2e8f0',     // slate-200
    waveformPlayed: '#0284c7',   // sky-600
    waveformBuffered: '#cbd5e1', // slate-300
    waveformPending: '#e2e8f0',  // slate-200

    // Sidebar
    sidebarBackground: '#f1f5f9', // slate-100
    sidebarBorder: '#e2e8f0',     // slate-200
    sidebarActiveBackground: 'rgba(2, 132, 199, 0.1)',
    sidebarActiveText: '#0369a1', // sky-700
    sidebarMutedText: '#64748b',  // slate-500

    // Status — darker for light bg
    textError: '#dc2626',        // red-600
    textWarning: '#d97706',      // amber-600
    textSuccess: '#16a34a',      // green-600
    textInfo: '#2563eb',         // blue-600

    // Analyzer Deck
    deckBg: 'rgba(248, 250, 252, 0.95)',
    deckBorder: '#e2e8f0',
    deckLabel: 'rgba(71, 85, 105, 0.4)',
    scopeGrid: 'rgba(0, 0, 0, 0.06)',
    scopeLine: '#0284c7',

    // Misc
    scrollbarThumb: '#cbd5e1',   // slate-300
    scrollbarThumbHover: '#94a3b8', // slate-400
    badgeBackground: 'rgba(2, 132, 199, 0.12)',
    badgeText: '#0369a1',        // sky-700
    deckHandle: '#0284c7',
  },
};
