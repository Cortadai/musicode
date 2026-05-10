import { describe, it, expect } from 'vitest';
import { parseLrc, findActiveLine, type LrcLine } from './lrcParser';

describe('parseLrc', () => {
  it('parses standard LRC lines', () => {
    const lrc = '[01:23.45]Hello world\n[02:00.00]Second line';
    const result = parseLrc(lrc);
    expect(result).toEqual([
      { time: 83.45, text: 'Hello world' },
      { time: 120, text: 'Second line' },
    ]);
  });

  it('parses lines without milliseconds', () => {
    const result = parseLrc('[00:30]No millis');
    expect(result).toEqual([{ time: 30, text: 'No millis' }]);
  });

  it('handles 1-digit milliseconds (padded to 3)', () => {
    const result = parseLrc('[00:10.5]Short frac');
    expect(result[0].time).toBeCloseTo(10.5);
  });

  it('handles 2-digit milliseconds', () => {
    const result = parseLrc('[00:10.50]Two digit');
    expect(result[0].time).toBeCloseTo(10.5);
  });

  it('handles 3-digit milliseconds', () => {
    const result = parseLrc('[00:10.123]Three digit');
    expect(result[0].time).toBeCloseTo(10.123);
  });

  it('skips lines without time tags', () => {
    const lrc = '[ti:Song Title]\n[00:01.00]Actual lyric\nPlain text';
    const result = parseLrc(lrc);
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('Actual lyric');
  });

  it('skips lines with empty text after tag', () => {
    const result = parseLrc('[00:05.00]   \n[00:10.00]Real text');
    expect(result).toEqual([{ time: 10, text: 'Real text' }]);
  });

  it('sorts lines by time', () => {
    const lrc = '[01:00.00]Second\n[00:30.00]First\n[02:00.00]Third';
    const result = parseLrc(lrc);
    expect(result.map(l => l.text)).toEqual(['First', 'Second', 'Third']);
  });

  it('returns empty array for no valid lines', () => {
    expect(parseLrc('')).toEqual([]);
    expect(parseLrc('No tags here')).toEqual([]);
  });

  it('handles 3-digit minutes', () => {
    const result = parseLrc('[100:00.00]Long track');
    expect(result[0].time).toBe(6000);
  });
});

describe('findActiveLine', () => {
  const lines: LrcLine[] = [
    { time: 10, text: 'A' },
    { time: 20, text: 'B' },
    { time: 30, text: 'C' },
  ];

  it('returns -1 for empty lines', () => {
    expect(findActiveLine([], 5)).toBe(-1);
  });

  it('returns -1 when before first line', () => {
    expect(findActiveLine(lines, 5)).toBe(-1);
  });

  it('returns first line at exact time', () => {
    expect(findActiveLine(lines, 10)).toBe(0);
  });

  it('returns correct line between timestamps', () => {
    expect(findActiveLine(lines, 25)).toBe(1);
  });

  it('returns last line when past all timestamps', () => {
    expect(findActiveLine(lines, 100)).toBe(2);
  });

  it('returns line at exact boundary', () => {
    expect(findActiveLine(lines, 30)).toBe(2);
  });
});
