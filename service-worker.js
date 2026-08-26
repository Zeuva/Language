const CACHE_NAME = 'zeuvastec-language-v11-mobile-stable';
const APP_FILES = [
  './', './index.html', './style.css', './voice.css', './fix.css', './levels.css', './profile.css',
  './home-redesign.css', './flashcard-flip.css', './hero-illustration.css',
  './app.js', './interaction-fix.js', './guided-voice.js', './pwa.js', './profile.js', './audio-unlock.js',
  './mobile-conversation-fix.js', './sound-fix.js', './simulador-bank.js', './exam.js', './requested-fixes.js',
  './avatar-3d.js', './startup.css', './startup-image.png', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES)).catch(()=>{}));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  const isAppCode = /\.(js|css|html)$/.test(url.pathname);
  if (isAppCode) {
    event.respondWith(fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match(event.request).then(r => r || caches.match('./index.html'))));
  } else {
    event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match('./index.html'))));
  }
});
