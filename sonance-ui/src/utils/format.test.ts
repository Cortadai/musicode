import { describe, it, expect } from 'vitest';
import { formatDuration, formatAlbumDuration } from './format';

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

describe('formatAlbumDuration', () => {
  it('formats minutes only when under an hour', () => {
    expect(formatAlbumDuration(1800)).toBe('30 min');
  });

  it('formats hours and minutes', () => {
    expect(formatAlbumDuration(3661)).toBe('1h 1 min');
  });

  it('formats exact hour', () => {
    expect(formatAlbumDuration(3600)).toBe('1h 0 min');
  });

  it('formats 0 seconds', () => {
    expect(formatAlbumDuration(0)).toBe('0 min');
  });

  it('formats multiple hours', () => {
    expect(formatAlbumDuration(7380)).toBe('2h 3 min');
  });
});
