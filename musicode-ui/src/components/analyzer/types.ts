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

export type VectorMode = 'lissajous' | 'polar';
export type VuMode = 'bars' | 'needle';
export type WaveformSpeed = 0.5 | 1 | 1.5;
export type OscilloscopeSpeed = 0.5 | 1 | 1.5;

export interface DeckConfig {
  visible: boolean;
  activeScopes: string[];   // ordered scope IDs
  proportions: number[];    // flex ratios matching activeScopes order
  fftSize: number;          // shared FFT size for frequency-domain scopes
  vectorMode: VectorMode;   // vectorscope display mode
  vuMode: VuMode;           // vu meter display mode
  waveformSpeed: WaveformSpeed;
  oscilloscopeSpeed: OscilloscopeSpeed;
}

export const FFT_SIZES = [1024, 2048, 4096, 8192, 16384] as const;

export const DEFAULT_DECK_CONFIG: DeckConfig = {
  visible: false,
  activeScopes: ['classicBars', 'spectrum', 'vectorscope'],
  proportions: [1.5, 2, 1],
  fftSize: 4096,
  vectorMode: 'lissajous',
  vuMode: 'bars',
  waveformSpeed: 1,
  oscilloscopeSpeed: 1,
};

export const SCOPE_REGISTRY: { id: string; name: string; defaultProportion: number; hasOptions?: boolean }[] = [
  { id: 'classicBars', name: 'Classic Bars', defaultProportion: 1.5 },
  { id: 'spectrum', name: 'Spectrum Analyzer', defaultProportion: 2, hasOptions: true },
  { id: 'vectorscope', name: 'Vectorscope', defaultProportion: 1, hasOptions: true },
  { id: 'oscilloscope', name: 'Oscilloscope', defaultProportion: 1.5, hasOptions: true },
  { id: 'spectrogram', name: 'Spectrogram', defaultProportion: 2, hasOptions: true },
  { id: 'vu', name: 'VU Meter', defaultProportion: 1.2, hasOptions: true },
  { id: 'lufs', name: 'LUFS Meter', defaultProportion: 1.2 },
  { id: 'waveform', name: 'Waveform', defaultProportion: 1.8, hasOptions: true },
];
