/* Slow Form — service worker.
   The app shell is cached so the coach and study mode work with no network at
   all. The pose model and its WebAssembly runtime are large and cross-origin,
   so they are cached opportunistically on first successful use, which is what
   lets the camera work offline from the second session onwards. */
const SHELL_CACHE = 'slowform-shell-v1';
const RUNTIME_CACHE = 'slowform-runtime-v1';
const SHELL = ['./', './index.html', './manifest.webmanifest',
  './icon-192.png', './icon-512.png', './icon-512-maskable.png',
  './apple-touch-icon.png', './favicon-64.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(SHELL_CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys
      .filter(k => k !== SHELL_CACHE && k !== RUNTIME_CACHE)
      .map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const sameOrigin = new URL(req.url).origin === self.location.origin;

  if (sameOrigin) {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(SHELL_CACHE).then(c => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match('./index.html')))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res && (res.ok || res.type === 'opaque')) {
        const copy = res.clone();
        caches.open(RUNTIME_CACHE).then(c => c.put(req, copy)).catch(() => {});
      }
      return res;
    }))
  );
});
