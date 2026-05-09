import { useEffect, useCallback, useRef } from 'react';
import gsap from 'gsap';
import type { LoginTransition as TransitionType } from '../../audio/audioPreferences';
import { loadPreferences } from '../../audio/audioPreferences';

const EFFECT_TYPES = ['ripple', 'curtain', 'fade', 'sweep', 'pixels', 'diagonal', 'wave'] as const;
type EffectType = (typeof EFFECT_TYPES)[number];

function resolveEffect(pref: TransitionType): EffectType | null {
  if (pref === 'none') return null;
  if (pref === 'random') return EFFECT_TYPES[Math.floor(Math.random() * EFFECT_TYPES.length)];
  return pref as EffectType;
}

function css(name: string, fb: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fb;
}

function colors() {
  return { bg: css('--mc-bg-base', '#0a0a0a'), accent: css('--mc-accent-primary', '#6366f1') };
}

function showRoot() {
  const root = document.getElementById('root');
  if (root) root.style.opacity = '1';
}

function animateDashboard() {
  showRoot();
}

function cleanup(overlay: HTMLElement) {
  overlay.remove();
  document.body.style.removeProperty('background');
  const root = document.getElementById('root');
  if (root) root.style.removeProperty('opacity');
}

// --- BUTTON MORPH (shared by all effects) ---

function morphButton(
  rect: DOMRect,
  accent: string,
): { el: HTMLDivElement; tl: gsap.core.Timeline } {
  const el = document.createElement('div');
  const size = rect.height;

  Object.assign(el.style, {
    position: 'fixed',
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    height: `${size}px`,
    borderRadius: '8px',
    background: accent,
    zIndex: '100000',
    pointerEvents: 'none',
  });
  document.body.appendChild(el);

  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const tl = gsap.timeline();

  tl.to(el, {
    width: size,
    left: rect.left + (rect.width - size) / 2,
    borderRadius: '50%',
    duration: 0.2,
    ease: 'power2.in',
  });
  tl.to(el, {
    left: cx - size / 2,
    top: cy - size / 2,
    scale: 1.15,
    boxShadow: `0 0 40px ${accent}88, 0 0 80px ${accent}44`,
    duration: 0.3,
    ease: 'power2.inOut',
  });
  tl.to(el, { scale: 1, duration: 0.08, ease: 'power1.out' });

  return { el, tl };
}

// --- EFFECTS ---

function runRipple(rect: DOMRect, c: ReturnType<typeof colors>, onNav: () => void) {
  const { el: dot, tl } = morphButton(rect, c.accent);
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const maxR = Math.hypot(
    Math.max(cx, window.innerWidth - cx),
    Math.max(cy, window.innerHeight - cy),
  );

  const ov = document.createElement('div');
  Object.assign(ov.style, {
    position: 'fixed', inset: '0', zIndex: '99999', pointerEvents: 'none',
    background: c.bg,
    clipPath: `circle(0px at ${cx}px ${cy}px)`,
  });
  document.body.appendChild(ov);

  // Cover: expand from center
  tl.to(ov, {
    clipPath: `circle(${maxR}px at ${cx}px ${cy}px)`,
    duration: 0.5,
    ease: 'power2.out',
    onStart: () => dot.remove(),
  });
  // Navigate while fully covered
  tl.add(() => {
    const root = document.getElementById('root');
    if (root) root.style.opacity = '0';
    onNav();
  });
  tl.add(() => showRoot(), '+=0.15');
  // Reveal: inverse ripple — dashboard animates in sync
  tl.to(ov, {
    clipPath: `circle(0px at ${cx}px ${cy}px)`,
    duration: 0.7,
    ease: 'power2.inOut',
    onStart: () => animateDashboard(),
    onComplete: () => cleanup(ov),
  });
}

function runCurtain(rect: DOMRect, c: ReturnType<typeof colors>, onNav: () => void) {
  const { el: dot, tl } = morphButton(rect, c.accent);
  const w = window.innerWidth, h = window.innerHeight;
  const mid = h / 2, cv = h * 0.08;

  const ov = document.createElement('div');
  Object.assign(ov.style, {
    position: 'fixed', inset: '0', zIndex: '99999', pointerEvents: 'none',
  });

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.setAttribute('preserveAspectRatio', 'none');
  Object.assign(svg.style, { position: 'absolute', inset: '0', width: '100%', height: '100%' });

  const topP = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  topP.setAttribute('d', `M0,0 L${w},0 L${w},${mid + cv} Q${w * .75},${mid - cv} ${w * .5},${mid} Q${w * .25},${mid + cv} 0,${mid - cv} Z`);
  topP.setAttribute('fill', c.bg);
  topP.style.transform = `translateY(-${h}px)`;

  const botP = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  botP.setAttribute('d', `M0,${h} L${w},${h} L${w},${mid - cv} Q${w * .75},${mid + cv} ${w * .5},${mid} Q${w * .25},${mid - cv} 0,${mid + cv} Z`);
  botP.setAttribute('fill', c.bg);
  botP.style.transform = `translateY(${h}px)`;

  const seam = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  seam.setAttribute('d', `M0,${mid - cv} Q${w * .25},${mid + cv} ${w * .5},${mid} Q${w * .75},${mid - cv} ${w},${mid + cv}`);
  seam.setAttribute('fill', 'none');
  seam.setAttribute('stroke', c.accent);
  seam.setAttribute('stroke-width', '3');
  seam.setAttribute('stroke-linecap', 'round');
  const len = seam.getTotalLength?.() || w * 1.2;
  Object.assign(seam.style, {
    strokeDasharray: `${len}`, strokeDashoffset: `${len}`,
    filter: `drop-shadow(0 0 8px ${c.accent})`, opacity: '0',
  });

  svg.append(topP, botP, seam);
  ov.appendChild(svg);
  document.body.appendChild(ov);

  // Cover: panels close from top/bottom
  tl.add(() => dot.remove());
  tl.to(topP.style, { transform: 'translateY(0)', duration: 0.5, ease: 'power3.inOut' });
  tl.to(botP.style, { transform: 'translateY(0)', duration: 0.5, ease: 'power3.inOut' }, '<');
  tl.to(seam.style, { opacity: '1', duration: 0.1 }, '-=0.2');
  tl.to(seam.style, { strokeDashoffset: '0', duration: 0.4, ease: 'power2.out' }, '<');
  tl.add(() => {
    const root = document.getElementById('root');
    if (root) root.style.opacity = '0';
    onNav();
  });

  tl.add(() => showRoot(), '+=0.15');
  // Reveal: panels open, seam fades — dashboard animates in sync
  tl.to(seam.style, { opacity: '0', duration: 0.2, onStart: () => animateDashboard() });
  tl.to(topP.style, { transform: `translateY(-${h}px)`, duration: 0.5, ease: 'power3.inOut' }, '<');
  tl.to(botP.style, { transform: `translateY(${h}px)`, duration: 0.5, ease: 'power3.inOut' }, '<');
  tl.add(() => cleanup(ov));
}

function runSweep(rect: DOMRect, c: ReturnType<typeof colors>, onNav: () => void) {
  const { el: dot, tl } = morphButton(rect, c.accent);
  const w = window.innerWidth, h = window.innerHeight;

  const sweep = document.createElement('div');
  Object.assign(sweep.style, {
    position: 'fixed', top: '0', left: `${w}px`,
    width: `${w}px`, height: '100vh',
    zIndex: '99999', pointerEvents: 'none',
    background: c.bg, overflow: 'hidden',
  });

  // Decorative SVG leading edge
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 80 ${h}`);
  svg.setAttribute('preserveAspectRatio', 'none');
  Object.assign(svg.style, { position: 'absolute', left: '-2px', top: '0', width: '80px', height: '100%' });

  // Glowing accent edge line
  const edge = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  edge.setAttribute('x1', '2'); edge.setAttribute('y1', '0');
  edge.setAttribute('x2', '2'); edge.setAttribute('y2', `${h}`);
  edge.setAttribute('stroke', c.accent);
  edge.setAttribute('stroke-width', '4');
  edge.setAttribute('filter', `drop-shadow(0 0 10px ${c.accent}) drop-shadow(0 0 20px ${c.accent}66)`);
  svg.appendChild(edge);

  // Diagonal dash decorations along the edge
  const dashCount = Math.ceil(h / 20);
  for (let i = 0; i < dashCount; i++) {
    const y = i * 20;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', '6'); line.setAttribute('y1', `${y}`);
    line.setAttribute('x2', '50'); line.setAttribute('y2', `${y - 12}`);
    line.setAttribute('stroke', c.accent);
    line.setAttribute('stroke-width', '1.5');
    line.setAttribute('opacity', `${0.3 + (i % 4) * 0.15}`);
    svg.appendChild(line);
  }
  sweep.appendChild(svg);

  // Accent gradient on leading area
  const grad = document.createElement('div');
  Object.assign(grad.style, {
    position: 'absolute', left: '0', top: '0',
    width: '150px', height: '100%',
    background: `linear-gradient(to right, ${c.accent}15, transparent)`,
    pointerEvents: 'none',
  });
  sweep.appendChild(grad);
  document.body.appendChild(sweep);

  tl.add(() => dot.remove());
  // Sweep in: cover the screen
  tl.to(sweep, {
    x: -w,
    duration: 0.7,
    ease: 'power3.inOut',
  });
  // Navigate while fully covered
  tl.add(() => {
    const root = document.getElementById('root');
    if (root) root.style.opacity = '0';
    onNav();
  });
  tl.add(() => showRoot(), '+=0.1');
  // Sweep out: reveal dashboard — dashboard animates in sync
  tl.to(sweep, {
    x: -(2 * w),
    duration: 0.7,
    ease: 'power3.inOut',
    onStart: () => animateDashboard(),
    onComplete: () => cleanup(sweep),
  });
}

function runFade(rect: DOMRect, c: ReturnType<typeof colors>, onNav: () => void) {
  const { el: dot, tl } = morphButton(rect, c.accent);

  const ov = document.createElement('div');
  Object.assign(ov.style, {
    position: 'fixed', inset: '0', zIndex: '99999', pointerEvents: 'none',
    background: c.bg, opacity: '0',
  });
  document.body.appendChild(ov);

  tl.add(() => dot.remove());
  tl.to(ov, {
    opacity: 1, duration: 0.4, ease: 'power2.in',
    onComplete: () => {
      const root = document.getElementById('root');
      if (root) root.style.opacity = '0';
      onNav();
    },
  });
  tl.add(() => showRoot(), '+=0.15');
  tl.to(ov, {
    opacity: 0, duration: 0.5, ease: 'power2.out',
    onStart: () => animateDashboard(),
    onComplete: () => cleanup(ov),
  });
}

// --- PIXELS ---

function runPixels(rect: DOMRect, c: ReturnType<typeof colors>, onNav: () => void) {
  const { el: dot, tl } = morphButton(rect, c.accent);
  const w = window.innerWidth, h = window.innerHeight;
  const cols = 12, rows = Math.ceil(h / (w / cols));
  const cellW = Math.ceil(w / cols), cellH = Math.ceil(h / rows);

  const container = document.createElement('div');
  Object.assign(container.style, {
    position: 'fixed', inset: '0', zIndex: '99999', pointerEvents: 'none',
  });

  const cells: HTMLDivElement[] = [];
  for (let r = 0; r < rows; r++) {
    for (let cl = 0; cl < cols; cl++) {
      const cell = document.createElement('div');
      Object.assign(cell.style, {
        position: 'absolute',
        left: `${cl * cellW}px`, top: `${r * cellH}px`,
        width: `${cellW + 1}px`, height: `${cellH + 1}px`,
        background: c.bg, opacity: '0',
      });
      container.appendChild(cell);
      cells.push(cell);
    }
  }
  document.body.appendChild(container);

  // Shuffle order for random fill pattern
  const shuffled = [...cells].sort(() => Math.random() - 0.5);
  const revealOrder = [...cells].sort(() => Math.random() - 0.5);

  tl.add(() => dot.remove());
  // Cover: pixels appear in random order
  tl.to(shuffled, {
    opacity: 1, duration: 0.02, stagger: { each: 0.008, ease: 'power1.in' },
  });
  tl.add(() => {
    const root = document.getElementById('root');
    if (root) root.style.opacity = '0';
    onNav();
  });
  tl.add(() => showRoot(), '+=0.1');
  // Reveal: pixels disappear in different random order
  tl.to(revealOrder, {
    opacity: 0, duration: 0.02, stagger: { each: 0.008, ease: 'power1.out' },
    onStart: () => animateDashboard(),
    onComplete: () => cleanup(container),
  });
}

// --- DIAGONAL ---

function runDiagonal(rect: DOMRect, c: ReturnType<typeof colors>, onNav: () => void) {
  const { el: dot, tl } = morphButton(rect, c.accent);
  const w = window.innerWidth, h = window.innerHeight;
  const diag = Math.hypot(w, h);
  const angle = Math.atan2(h, w) * (180 / Math.PI);

  const ov = document.createElement('div');
  Object.assign(ov.style, {
    position: 'fixed', inset: '0', zIndex: '99999', pointerEvents: 'none', overflow: 'hidden',
  });

  // Panel needs to be tall enough to cover the screen at any rotation offset.
  // Width = diag (full diagonal length), height = diag * 2 (extends above and below origin).
  const panelW = diag + 200;
  const panelH = diag * 2;
  const panel = document.createElement('div');
  Object.assign(panel.style, {
    position: 'absolute',
    width: `${panelW}px`, height: `${panelH}px`,
    top: `${-panelH / 2}px`, left: '0',
    transformOrigin: '0 50%',
    transform: `rotate(${angle}deg) translateX(${-panelW}px)`,
    background: c.bg,
  });

  const edge = document.createElement('div');
  Object.assign(edge.style, {
    position: 'absolute', right: '0', top: '0',
    width: '4px', height: '100%',
    background: c.accent,
    boxShadow: `0 0 20px ${c.accent}, 0 0 40px ${c.accent}66`,
  });
  panel.appendChild(edge);
  ov.appendChild(panel);
  document.body.appendChild(ov);

  const startX = -panelW;
  const coveredX = 0;
  const exitX = panelW;

  tl.add(() => dot.remove());
  tl.to({ v: startX }, {
    v: coveredX, duration: 0.6, ease: 'power3.inOut',
    onUpdate() {
      panel.style.transform = `rotate(${angle}deg) translateX(${(this.targets()[0] as { v: number }).v}px)`;
    },
  });
  tl.add(() => {
    const root = document.getElementById('root');
    if (root) root.style.opacity = '0';
    onNav();
  });
  tl.add(() => showRoot(), '+=0.1');
  tl.to({ v: coveredX }, {
    v: exitX, duration: 0.6, ease: 'power3.inOut',
    onStart: () => animateDashboard(),
    onUpdate() {
      panel.style.transform = `rotate(${angle}deg) translateX(${(this.targets()[0] as { v: number }).v}px)`;
    },
    onComplete: () => cleanup(ov),
  });
}

// --- WAVE ---

function runWave(rect: DOMRect, c: ReturnType<typeof colors>, onNav: () => void) {
  const { el: dot, tl } = morphButton(rect, c.accent);
  const w = window.innerWidth, h = window.innerHeight;

  const ov = document.createElement('div');
  Object.assign(ov.style, {
    position: 'fixed', inset: '0', zIndex: '99999', pointerEvents: 'none',
  });

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.setAttribute('preserveAspectRatio', 'none');
  Object.assign(svg.style, { position: 'absolute', inset: '0', width: '100%', height: '100%' });

  // Sound wave shaped clip: a jagged waveform edge that sweeps across
  const waveAmp = h * 0.12;
  const freq = 8;
  const buildWavePath = (xOffset: number) => {
    let d = `M${xOffset},0 L-200,0 L-200,${h} L${xOffset},${h}`;
    const steps = 40;
    for (let i = steps; i >= 0; i--) {
      const y = (i / steps) * h;
      const waveX = xOffset + Math.sin((i / steps) * Math.PI * freq) * waveAmp;
      d += ` L${waveX},${y}`;
    }
    d += ' Z';
    return d;
  };

  const wavePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  wavePath.setAttribute('d', buildWavePath(-200));
  wavePath.setAttribute('fill', c.bg);

  // Accent glow on the wave edge
  const waveLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  const buildWaveEdge = (xOffset: number) => {
    let d = '';
    const steps = 40;
    for (let i = 0; i <= steps; i++) {
      const y = (i / steps) * h;
      const waveX = xOffset + Math.sin((i / steps) * Math.PI * freq) * waveAmp;
      d += i === 0 ? `M${waveX},${y}` : ` L${waveX},${y}`;
    }
    return d;
  };
  waveLine.setAttribute('d', buildWaveEdge(-200));
  waveLine.setAttribute('fill', 'none');
  waveLine.setAttribute('stroke', c.accent);
  waveLine.setAttribute('stroke-width', '3');
  waveLine.setAttribute('filter', `drop-shadow(0 0 10px ${c.accent}) drop-shadow(0 0 20px ${c.accent}66)`);

  svg.append(wavePath, waveLine);
  ov.appendChild(svg);
  document.body.appendChild(ov);

  tl.add(() => dot.remove());
  // Cover: wave sweeps left to right across the screen
  tl.to({ x: 0 }, {
    x: w + 400, duration: 0.6, ease: 'power3.inOut',
    onUpdate() {
      const x = -200 + this.targets()[0].x;
      wavePath.setAttribute('d', buildWavePath(x));
      waveLine.setAttribute('d', buildWaveEdge(x));
    },
  });
  tl.add(() => {
    const root = document.getElementById('root');
    if (root) root.style.opacity = '0';
    onNav();
  });
  tl.add(() => showRoot(), '+=0.1');
  // Reveal: wave sweeps back left, uncovering dashboard from the right
  tl.to({ x: w + 200 }, {
    x: -200, duration: 0.6, ease: 'power3.inOut',
    onStart: () => animateDashboard(),
    onUpdate() {
      const x = (this.targets()[0] as { x: number }).x;
      wavePath.setAttribute('d', buildWavePath(x));
      waveLine.setAttribute('d', buildWaveEdge(x));
    },
    onComplete: () => cleanup(ov),
  });
}

// --- COMPONENT ---

interface Props {
  active: boolean;
  originRef?: React.RefObject<HTMLElement | null>;
  onComplete: () => void;
}

export default function LoginTransition({ active, originRef, onComplete }: Props) {
  const firedRef = useRef(false);

  const fire = useCallback(() => {
    if (firedRef.current) return;
    firedRef.current = true;

    const pref = loadPreferences().loginTransition;
    const effect = resolveEffect(pref);
    if (!effect) { onComplete(); return; }

    const rect = originRef?.current?.getBoundingClientRect()
      ?? new DOMRect(window.innerWidth / 2 - 80, window.innerHeight / 2, 160, 40);
    if (originRef?.current) originRef.current.style.visibility = 'hidden';

    const c = colors();
    document.body.style.background = c.bg;
    const run = { ripple: runRipple, curtain: runCurtain, sweep: runSweep, fade: runFade, pixels: runPixels, diagonal: runDiagonal, wave: runWave }[effect];
    run(rect, c, onComplete);
  }, [onComplete, originRef]);

  useEffect(() => { if (active) fire(); }, [active, fire]);

  return null;
}
