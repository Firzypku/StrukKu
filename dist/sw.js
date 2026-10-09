/**
 * Service Worker untuk GREENWORTH Surabaya PWA
 * Selalu mengambil versi terbaru dan membersihkan cache usang.
 */

const CACHE_NAME = 'greenworth-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http')) return;

  // Network first untuk semua file
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
