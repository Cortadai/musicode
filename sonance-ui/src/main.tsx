import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

if ((window as any).electronAPI) {
  document.documentElement.classList.add('electron');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((reg) => reg.unregister());
  });
  caches.keys().then((keys) => {
    keys.forEach((key) => caches.delete(key));
  });
}
