// sw.js — MSA PLATFORM CACHE WORKER

const CACHE_NAME = "msa-cache-v1";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./sw.js",
  "./images/msa-logo.png",
  "./images/stylo.png",
  "./data/mots.json",
  "./data/interface-langues.json"
];

// 🔹 INSTALLATION
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("✅ Caching static assets...");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 🔸 ACTIVATION
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log("🧹 Old cache deleted:", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// ⚡ FETCH HANDLER
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Serve from cache if available
      if (cachedResponse) return cachedResponse;

      // Else fetch from network
      return fetch(event.request).catch(() => {
        // Si c'est une page HTML : fallback sur index.html
        if (event.request.destination === "document") {
          return caches.match("./index.html");
        }
        return null;
      });
    })
  );
});
