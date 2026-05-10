import type { ShellConfig } from '../types';

export const minimalShell: ShellConfig = {
  name: 'minimal',
  label: 'Minimal',
  layout: 'horizontal',
  tokens: {
    fontBody: "'JetBrains Mono', 'Fira Code', monospace",
    fontMono: "'JetBrains Mono', 'Fira Code', monospace",
    radiusSm: '2px',
    radiusMd: '6px',
    radiusLg: '8px',
    radiusXl: '12px',
    glassBlur: '12px',
  },
};
