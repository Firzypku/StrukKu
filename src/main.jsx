import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Tangani vite:preloadError saat versi baru di-deploy dan chunk lama tidak ditemukan
window.addEventListener('vite:preloadError', (event) => {
  try {
    const hasReloaded = sessionStorage.getItem('vite_preload_reloaded');
    if (!hasReloaded) {
      sessionStorage.setItem('vite_preload_reloaded', 'true');
      window.location.reload();
    } else {
      sessionStorage.removeItem('vite_preload_reloaded');
      console.error('Preload error loop dicegah:', event);
    }
  } catch {
    window.location.reload();
  }
});

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // SW registration failed, app still works normally
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
