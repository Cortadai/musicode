import { useState, useEffect } from 'react';
import { loadPreferences } from '../audio/audioPreferences';

const EVENT_NAME = 'sonance-particles-changed';

export function useParticlesEnabled(): boolean {
  const [enabled, setEnabled] = useState(() => loadPreferences().particlesEnabled);

  useEffect(() => {
    const handler = () => setEnabled(loadPreferences().particlesEnabled);
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  }, []);

  return enabled;
}
