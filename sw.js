const CACHE_NAME = 'trade-dash-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Install event: Cache the core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
  self.skipWaiting();
});

// Activate event: Clean up old caches if the version changes
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event: Serve from cache if offline, otherwise fetch from network
self.addEventListener('fetch', (event) => {
  // We only want to cache the UI, not the live WebSocket connections
  if (event.request.url.startsWith('wss://')) {
      return; 
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return the cached response if found, else fetch from the network
        return response || fetch(event.request);
      })
  );
});
