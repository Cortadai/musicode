import { describe, it, expect } from 'vitest';
import { artistGradient, artistInitials } from './artistAvatar';

describe('artistGradient', () => {
  it('returns a CSS linear-gradient string', () => {
    const result = artistGradient('Pink Floyd');
    expect(result).toMatch(/^linear-gradient\(\d+deg, #[0-9a-f]+, #[0-9a-f]+\)$/);
  });

  it('is deterministic for same name', () => {
    expect(artistGradient('Queen')).toBe(artistGradient('Queen'));
  });

  it('produces different gradients for different names', () => {
    expect(artistGradient('Queen')).not.toBe(artistGradient('Beatles'));
  });

  it('handles single character name', () => {
    const result = artistGradient('X');
    expect(result).toMatch(/^linear-gradient/);
  });
});

describe('artistInitials', () => {
  it('returns two initials for two-word name', () => {
    expect(artistInitials('Pink Floyd')).toBe('PF');
  });

  it('returns first and last initials for multi-word name', () => {
    expect(artistInitials('The Rolling Stones')).toBe('TS');
  });

  it('returns first two chars for single-word name', () => {
    expect(artistInitials('Metallica')).toBe('ME');
  });

  it('handles extra whitespace', () => {
    expect(artistInitials('  Led   Zeppelin  ')).toBe('LZ');
  });

  it('uppercases lowercase input', () => {
    expect(artistInitials('bob marley')).toBe('BM');
  });

  it('returns ? for empty string', () => {
    expect(artistInitials('')).toBe('?');
  });
});
