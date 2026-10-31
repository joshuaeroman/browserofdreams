/**
 * Browser of Dreams - Service Worker (PWA)
 * Caches the core retro browser shell and enables offline standalone operation.
 * External LLM and image provider API requests are strictly bypassed (never cached).
 */

const CACHE_NAME = "dreams-pwa-v3";

const PRECACHE_ASSETS = [
  "./",
  "./index.html",
  "./dist/app.js?v=3",
  "./dist/app.css?v=3",
  "./manifest.webmanifest",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-192.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png"
];

// Helper to determine if a request targets an external AI API or dynamic provider
function isExternalApiRequest(requestUrl) {
  try {
    const parsed = new URL(requestUrl);
    // Any cross-origin request is an external API (OpenRouter, Gemini, OpenCode, Unsplash, etc.)
    if (parsed.origin !== self.location.origin) {
      return true;
    }
    // Any path with /api/ or custom bridge calls
    if (parsed.pathname.startsWith("/api/")) {
      return true;
    }
  } catch (_e) {
    return false;
  }
  return false;
}

// 1. Install Event: Precache app shell
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return Promise.all(PRECACHE_ASSETS.map(function(asset) {
        return cache.add(new Request(asset, { cache: "reload" }));
      })).catch(function(err) {
        console.warn("[SW] Some precache assets failed to cache:", err);
      });
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

// 2. Activate Event: Clean up outdated cache buckets and claim clients
self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(key) {
          if (key !== CACHE_NAME) {
            console.log("[SW] Deleting stale cache bucket:", key);
            return caches.delete(key);
          }
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// 3. Fetch Event: network-first navigations, stale-while-revalidate assets,
// bypass for AI APIs
self.addEventListener("fetch", function(event) {
  const req = event.request;

  // Only handle GET requests
  if (req.method !== "GET") {
    return;
  }

  // Strictly bypass external AI APIs and streaming endpoints
  if (isExternalApiRequest(req.url)) {
    return;
  }

  // Navigations are network-first so an updated shell is never masked by a
  // stale cached index.html; offline falls back to the cached shell.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).then(function(networkResponse) {
        if (!networkResponse || !networkResponse.ok) {
          throw new Error("HTTP " + (networkResponse && networkResponse.status));
        }
        const responseClone = networkResponse.clone();
        event.waitUntil(
          caches.open(CACHE_NAME).then(function(cache) {
            return cache.put(req, responseClone);
          }).catch(function() {})
        );
        return networkResponse;
      }).catch(function() {
        return caches.match(req).then(function(cached) {
          return cached || caches.match("./index.html");
        });
      })
    );
    return;
  }

  // Stale-While-Revalidate for app assets (navigations handled above)
  event.respondWith(
    caches.match(req).then(function(cachedResponse) {
      const fetchPromise = fetch(req).then(function(networkResponse) {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(req, responseClone);
          });
        }
        return networkResponse;
      }).catch(function(err) {
        throw err;
      });

      // Stale-While-Revalidate: return cached copy if available, else await network
      return cachedResponse || fetchPromise;
    })
  );
});
