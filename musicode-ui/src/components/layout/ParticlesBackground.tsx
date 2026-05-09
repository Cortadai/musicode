import { memo, useEffect, useMemo, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

let engineReady = false;
let enginePromise: Promise<void> | null = null;

function ensureEngine(): Promise<void> {
  if (engineReady) return Promise.resolve();
  if (!enginePromise) {
    enginePromise = initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      engineReady = true;
    });
  }
  return enginePromise;
}

function getCssVar(name: string, fallback: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim() || fallback;
}

function ParticlesBackground() {
  const [ready, setReady] = useState(engineReady);
  const [accent, setAccent] = useState(() => getCssVar('--mc-accent-primary', '#888888'));

  useEffect(() => {
    if (!ready) {
      ensureEngine().then(() => setReady(true));
    }
  }, [ready]);

  useEffect(() => {
    const handler = () => {
      setAccent(getCssVar('--mc-accent-primary', '#888888'));
    };
    window.addEventListener('musicode-theme-changed', handler);
    return () => window.removeEventListener('musicode-theme-changed', handler);
  }, []);

  const options = useMemo(
    () => ({
      background: { color: { value: 'transparent' } },
      fpsLimit: 60,
      interactivity: {
        events: {
          onClick: { enable: true, mode: 'repulse' as const },
          onHover: { enable: true, mode: 'grab' as const },
        },
        modes: {
          repulse: { distance: 150, duration: 0.4 },
          grab: { distance: 140, links: { opacity: 0.5 } },
        },
      },
      particles: {
        color: { value: accent },
        links: {
          color: accent,
          distance: 120,
          enable: false,
          opacity: 0.15,
          width: 1,
        },
        move: {
          enable: true,
          speed: 0.8,
          direction: 'none' as const,
          random: true,
          straight: false,
          outModes: { default: 'bounce' as const },
        },
        number: {
          density: { enable: true },
          value: 60,
        },
        opacity: { value: { min: 0.3, max: 0.7 } },
        shape: { type: 'circle' },
        size: { value: { min: 1, max: 2.5 } },
      },
      detectRetina: true,
    }),
    [accent],
  );

  if (!ready) return null;

  return (
    <Particles
      id="musicode-particles"
      className="!absolute inset-0"
      style={{ zIndex: 0 }}
      options={options}
    />
  );
}

export default memo(ParticlesBackground);
