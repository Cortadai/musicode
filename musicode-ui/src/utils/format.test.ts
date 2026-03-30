import { describe, it, expect } from 'vitest';
import { formatDuration } from './format';

describe('formatDuration', () => {
  it('returns dash for null', () => {
    expect(formatDuration(null)).toBe('—');
  });

  it('returns dash for 0', () => {
    expect(formatDuration(0)).toBe('—');
  });

  it('formats seconds under a minute', () => {
    expect(formatDuration(45)).toBe('0:45');
  });

  it('formats exact minute', () => {
    expect(formatDuration(60)).toBe('1:00');
  });

  it('formats minutes and seconds with padding', () => {
    expect(formatDuration(65)).toBe('1:05');
  });

  it('formats large values', () => {
    expect(formatDuration(3661)).toBe('61:01');
  });

  it('formats 5:09 correctly', () => {
    expect(formatDuration(309)).toBe('5:09');
  });
});
