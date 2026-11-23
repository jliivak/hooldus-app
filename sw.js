// Hooldus PWA service worker · versioon d008183370 (tools/pwa.js)
// Rakenduse failid tulevad vahemälust kohe (avaneb ka ilma levita), uus versioon laetakse taustal ja kehtib järgmisel avamisel.
// API päringuid (teine domeen, POST) ei puututa: andmed ja ootel muudatused hoiab rakendus ise (localStorage).
const CACHE = 'hooldus-d008183370', FAILID = ["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","apple-touch-icon.png"];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FAILID)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x.indexOf('hooldus-') === 0 && x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== self.location.origin) return;
  e.respondWith(caches.open(CACHE).then(c => c.match(r, { ignoreSearch: true }).then(vana => {
    const uus = fetch(r).then(v => { if (v && v.ok && v.type === 'basic') c.put(r.mode === 'navigate' ? './' : r, v.clone()); return v; }).catch(() => vana);
    return vana || uus;
  })));
});
