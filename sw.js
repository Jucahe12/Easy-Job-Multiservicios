const CACHE = "easy-job-v2";
const ASSETS = [
  "/",
  "/index.html",
  "/styles.css",
  "/script.js",
  "/manifest.json",
  "/404.html",
  "/privacidad.html",
  "/assets/icons/icon-192x192.png",
  "/assets/icons/icon-512x512.png",
  "/assets/media/Logo%20Easy%20Job.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => Promise.all(
        ASSETS.map((url) =>
          fetch(url, { method: "HEAD" })
            .then((res) => res.ok ? c.add(url) : null)
            .catch(() => null)
        )
      ))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((response) => {
        if (response && response.status === 200 && response.type === "basic") {
          const clone = response.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
        }
        return response;
      }).catch(() => cached);
    })
  );
});
