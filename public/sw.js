const CACHE = 'math-tooling-notebook-v2';
const SHELL = ['/', '/assets/math-railway.webp', '/assets/math-railway-400.webp', '/icon.svg', '/privacy/', '/terms/'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then(async (cache) => {
    await cache.addAll(SHELL.map((url) => new Request(url, { cache: 'reload' })));
    const response = await cache.match('/');
    const html = response ? await response.text() : '';
    const assets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)"/g)].map((match) => match[1]);
    await cache.addAll([...new Set(assets)].map((url) => new Request(url, { cache: 'reload' })));
  }).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== location.origin) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).then((response) => {
        if (response.ok) caches.open(CACHE).then((cache) => cache.put(event.request, response.clone()));
        return response;
      }).catch(async () => (await caches.match(event.request)) || caches.match('/'))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request, { ignoreVary: true }).then((cached) => cached || fetch(event.request).then((response) => {
      if (response.ok) caches.open(CACHE).then((cache) => cache.put(event.request, response.clone()));
      return response;
    }))
  );
});
