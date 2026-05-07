import type { DeckDataSource } from '../../audio/analyzerDeckDataSource';

export interface ScopeRenderer {
  id: string;
  name: string;
  render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    dataSource: DeckDataSource,
  ): void;
  dispose?(): void;
}

export interface DeckConfig {
  visible: boolean;
  activeScopes: string[];   // ordered scope IDs
  proportions: number[];    // flex ratios matching activeScopes order
}

export const DEFAULT_DECK_CONFIG: DeckConfig = {
  visible: false,
  activeScopes: ['spectrum'],
  proportions: [1],
};

export const SCOPE_REGISTRY: { id: string; name: string }[] = [
  { id: 'spectrum', name: 'Spectrum Analyzer' },
  { id: 'oscilloscope', name: 'Oscilloscope' },
  { id: 'vectorscope', name: 'Vectorscope' },
  { id: 'spectrogram', name: 'Spectrogram' },
  { id: 'waveform', name: 'Waveform' },
  { id: 'vu', name: 'VU Meter' },
  { id: 'lufs', name: 'LUFS Meter' },
];
