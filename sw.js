// Funcionamento offline. A CADA atualização publicada, troque "ficha-8" por "ficha-9" (e assim por diante).
const CACHE = "ficha-8";
const ARQ = ["./", "./index.html", "./app-extras.js", "./manifest.json", "./catalogo.json", "./docx.js",
             "./icons/logo-itazi.png", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/apple-touch-icon.png"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(ARQ.map(a => c.add(a).catch(() => null)))));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
// Rede primeiro, mas com limite de 4 s: com sinal fraco em campo, usa a cópia guardada no aparelho
const comLimite = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error("tempo")), ms))]);
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || !req.url.startsWith(self.location.origin)) return;   // CEP (ViaCEP) e outros sites passam direto
  const rede = fetch(req).then(r => { if (r.ok) { const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)); } return r; });
  e.respondWith(
    comLimite(rede, 4000).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || rede.catch(() => caches.match("./index.html"))))
  );
});
