/**
 * sw.js — Service Worker for CWV Optimized Site
 *
 * Strategies:
 *  • Shell (HTML/CSS/JS): Cache-first with network fallback
 *  • Images:              Stale-while-revalidate
 *  • API/HTML:            Network-first with cache fallback
 */

const VERSION      = 'v1.0.0';
const CACHE_SHELL  = `cwv-shell-${VERSION}`;
const CACHE_IMAGES = `cwv-images-${VERSION}`;

const SHELL_ASSETS = [
  '/cwv-project/optimized-site/',
  '/cwv-project/optimized-site/index.html',
  '/cwv-project/optimized-site/css/styles.css',
  '/cwv-project/optimized-site/js/main.js',
];

/*  Install: pre-cache the app shell  */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_SHELL)
      .then(cache => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting())
  );
});

/*  Activate: purge old caches  */
self.addEventListener('activate', event => {
  const currentCaches = [CACHE_SHELL, CACHE_IMAGES];
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(k => !currentCaches.includes(k))
          .map(k  => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

/*  Fetch: route-based strategy  */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  /* Skip non-GET and cross-origin (except fonts/images) */
  if (request.method !== 'GET') return;

  /* Images -> stale-while-revalidate */
  if (/\.(jpe?g|png|gif|webp|avif|svg|ico)$/i.test(url.pathname)
      || url.hostname === 'picsum.photos') {
    event.respondWith(staleWhileRevalidate(request, CACHE_IMAGES));
    return;
  }

  /* Shell assets -> cache-first */
  if (SHELL_ASSETS.some(a => request.url.endsWith(a.replace('/cwv-project/optimized-site', '')))) {
    event.respondWith(cacheFirst(request, CACHE_SHELL));
    return;
  }

  /* Everything else -> network-first */
  event.respondWith(networkFirst(request, CACHE_SHELL));
});

/*  Strategy helpers  */

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
  }
  return response;
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return caches.match(request);
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache  = await caches.open(cacheName);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => null);
  return cached || fetchPromise;
}
