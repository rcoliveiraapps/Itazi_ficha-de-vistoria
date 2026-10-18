// Funcionamento offline. A CADA atualização publicada, troque "ficha-5" por "ficha-6" (e assim por diante).
const CACHE = "ficha-5";
const ARQ = ["./", "./index.html", "./app-extras.js", "./manifest.json", "./icons/logo-itazi.png", "./docx.js",
             "./icons/icon-192.png", "./icons/icon-512.png", "./icons/apple-touch-icon.png"];
self.addEventListener("install", e => {
  // guarda arquivo por arquivo: se algum faltar, o app continua funcionando
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(ARQ.map(a => c.add(a).catch(() => null)))));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || !req.url.startsWith(self.location.origin)) return;   // só arquivos do próprio app
  e.respondWith(
    fetch(req).then(r => {
      if (r.ok) { const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)); }   // não guarda páginas de erro
      return r;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match("./index.html")))
  );
});
