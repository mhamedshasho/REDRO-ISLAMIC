const CACHE_NAME = 'redro-islamic-v3';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './adhkar-api-data.js',
  './manifest.json',\n  './legacy-polyfills.js',\n  './offline-data.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
      caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME && k !== 'redro-interface-assets-v1' && k !== 'redro-quran-audio-v1').map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Network first for APIs, cache first for assets
  if (e.request.url.includes('api.aladhan.com') || 
      e.request.url.includes('api.alquran.cloud') ||
      e.request.url.includes('cdn.islamic.network')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
