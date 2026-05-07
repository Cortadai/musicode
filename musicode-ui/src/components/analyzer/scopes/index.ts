import { classicBars } from './ClassicBars';
import { spectrumAnalyzer } from './SpectrumAnalyzer';
import { oscilloscope } from './Oscilloscope';
import { vectorscope } from './Vectorscope';
import { spectrogram } from './Spectrogram';
import { vuMeter } from './VUMeter';
import { lufsMeter } from './LUFSMeter';
import { waveform } from './Waveform';
import type { ScopeRenderer } from '../types';

export const allScopes: ScopeRenderer[] = [
  classicBars,
  spectrumAnalyzer,
  vectorscope,
  oscilloscope,
  spectrogram,
  vuMeter,
  lufsMeter,
  waveform,
];

export function buildScopeMap(): Map<string, ScopeRenderer> {
  const map = new Map<string, ScopeRenderer>();
  for (const scope of allScopes) {
    map.set(scope.id, scope);
  }
  return map;
}
