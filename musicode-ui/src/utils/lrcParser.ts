export interface LrcLine {
  time: number;
  text: string;
}

const TIME_TAG = /^\[(\d{1,3}):(\d{2})(?:\.(\d{1,3}))?\]/;

export function parseLrc(lrc: string): LrcLine[] {
  const lines: LrcLine[] = [];

  for (const raw of lrc.split('\n')) {
    const match = raw.match(TIME_TAG);
    if (!match) continue;

    const minutes = parseInt(match[1], 10);
    const seconds = parseInt(match[2], 10);
    let millis = 0;
    if (match[3]) {
      const frac = match[3];
      millis = parseInt(frac.padEnd(3, '0').slice(0, 3), 10);
    }

    const time = minutes * 60 + seconds + millis / 1000;
    const text = raw.replace(TIME_TAG, '').trim();
    if (text) lines.push({ time, text });
  }

  lines.sort((a, b) => a.time - b.time);
  return lines;
}

export function findActiveLine(lines: LrcLine[], currentTime: number): number {
  if (lines.length === 0) return -1;

  let active = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].time <= currentTime) {
      active = i;
    } else {
      break;
    }
  }
  return active;
}
