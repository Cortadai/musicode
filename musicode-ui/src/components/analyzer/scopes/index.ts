import { spectrumAnalyzer } from './SpectrumAnalyzer';
import type { ScopeRenderer } from '../types';

export const allScopes: ScopeRenderer[] = [
  spectrumAnalyzer,
];

export function buildScopeMap(): Map<string, ScopeRenderer> {
  const map = new Map<string, ScopeRenderer>();
  for (const scope of allScopes) {
    map.set(scope.id, scope);
  }
  return map;
}
