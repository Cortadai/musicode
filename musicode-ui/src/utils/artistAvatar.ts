const GRADIENTS = [
  ['#6366f1', '#818cf8'], // indigo
  ['#8b5cf6', '#a78bfa'], // violet
  ['#6d28d9', '#7c3aed'], // purple
  ['#4f46e5', '#6366f1'], // indigo-deep
  ['#7c3aed', '#818cf8'], // violet-indigo
  ['#5b21b6', '#8b5cf6'], // purple-deep
  ['#4338ca', '#6366f1'], // indigo-dark
  ['#6d28d9', '#a78bfa'], // purple-light
];

function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function artistGradient(name: string): string {
  const idx = hashName(name) % GRADIENTS.length;
  const [from, to] = GRADIENTS[idx];
  const angle = 135 + (hashName(name + 'angle') % 90);
  return `linear-gradient(${angle}deg, ${from}, ${to})`;
}

export function artistInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return (name.slice(0, 2) || '?').toUpperCase();
}
