import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// --- Service Worker registration (production only) ---
// In dev mode, Vite's HMR uses its own request handling — a SW would intercept
// those requests and cause refresh loops or stale module serving.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then((reg) => {
        console.debug('[sw] Registered, scope:', reg.scope);
      })
      .catch((err) => {
        console.debug('[sw] Registration failed:', err.message);
      });
  });
}
