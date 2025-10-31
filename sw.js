const CACHE_NAME = 'radioplus-v1';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => {
      if (k !== CACHE_NAME) return caches.delete(k);
    })))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  // For navigations, serve app shell
  if (evt.request.mode === 'navigate') {
    evt.respondWith(fetch(evt.request).catch(() => caches.match('/index.html')));
    return;
  }
  // Otherwise try network, fallback to cache
  evt.respondWith(fetch(evt.request).catch(() => caches.match(evt.request)));
});
