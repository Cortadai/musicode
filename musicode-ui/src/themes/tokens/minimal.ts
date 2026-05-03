import type { ThemeConfig } from '../types';

export const minimalTheme: ThemeConfig = {
  name: 'minimal',
  label: 'Minimal',
  layout: 'horizontal',
  tokens: {
    // Backgrounds — cleaner, slightly warmer
    bgBase: '#0a0a0c',
    bgSurface: '#141416',
    bgSurfaceHover: '#1c1c20',
    bgElevated: '#181818',
    bgOverlay: 'rgba(0, 0, 0, 0.5)',

    // Borders — minimal, almost invisible
    borderDefault: '#1f1f22',
    borderSubtle: '#16161a',
    borderAccent: '#6366f1',     // indigo-500

    // Text
    textPrimary: '#fafafa',      // zinc-50
    textSecondary: '#a1a1aa',    // zinc-400
    textMuted: '#71717a',        // zinc-500
    textInverse: '#0a0a0c',

    // Accent — indigo (shared palette)
    accentPrimary: '#818cf8',    // indigo-400
    accentPrimaryHover: '#6366f1', // indigo-500
    accentPrimaryMuted: 'rgba(99, 102, 241, 0.15)',
    accentSecondary: '#a78bfa',  // violet-400

    // Glassmorphism — very subtle
    glassBackground: 'rgba(255, 255, 255, 0.02)',
    glassBorder: 'rgba(255, 255, 255, 0.05)',
    glassBlur: '8px',

    // Player
    playerBackground: '#141416',
    playerBorder: '#1f1f22',
    waveformPlayed: '#818cf8',
    waveformBuffered: '#2a2a30',
    waveformPending: '#1c1c20',

    // Sidebar — not used in minimal, but populated for type safety
    sidebarBackground: '#0a0a0c',
    sidebarBorder: '#1f1f22',
    sidebarActiveBackground: 'rgba(99, 102, 241, 0.1)',
    sidebarActiveText: '#818cf8',
    sidebarMutedText: '#71717a',

    // Status
    textError: '#f87171',        // red-400
    textWarning: '#fbbf24',      // amber-400
    textSuccess: '#4ade80',      // green-400
    textInfo: '#60a5fa',          // blue-400

    // Misc
    scrollbarThumb: '#2a2a30',
    scrollbarThumbHover: '#3a3a42',
    badgeBackground: 'rgba(99, 102, 241, 0.15)',
    badgeText: '#818cf8',

    // Typography — mono-first for that clean technical look
    fontBody: "'JetBrains Mono', 'Fira Code', monospace",
    fontMono: "'JetBrains Mono', 'Fira Code', monospace",

    // Spacing / Radius — tighter
    radiusSm: '2px',
    radiusMd: '6px',
    radiusLg: '8px',
    radiusXl: '12px',
  },
};
