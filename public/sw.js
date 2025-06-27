const CACHE_NAME = "music-x-music-v1";
const API_CACHE_NAME = "api-cache-v1";

// 캐시할 정적 리소스
const urlsToCache = [
  "/",
  "/search",
  "/trend",
  "/new",
  "/profile",
  "/manifest.json",
];

// Apple Music API 응답 캐싱 시간 (30분)
const API_CACHE_TIME = 30 * 60 * 1000;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Apple Music API 요청인지 확인
  if (url.pathname.startsWith("/api/apple-music/")) {
    event.respondWith(handleApiRequest(event.request));
    return;
  }

  // 일반 요청 처리
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE_NAME);
  const cachedResponse = await cache.match(request);

  // 캐시된 응답이 있고 아직 유효한지 확인
  if (cachedResponse) {
    const cachedAt = cachedResponse.headers.get("sw-cached-at");
    if (cachedAt) {
      const cacheAge = Date.now() - parseInt(cachedAt);
      if (cacheAge < API_CACHE_TIME) {
        console.log("API 캐시에서 응답 반환:", request.url);
        return cachedResponse;
      }
    }
  }

  try {
    // 네트워크에서 새로운 응답 가져오기
    console.log("네트워크에서 API 요청:", request.url);
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // 응답을 복제하고 캐시에 저장
      const responseToCache = networkResponse.clone();
      const headers = new Headers(responseToCache.headers);
      headers.set("sw-cached-at", Date.now().toString());

      const responseWithCacheHeaders = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers,
      });

      cache.put(request, responseWithCacheHeaders);
    }

    return networkResponse;
  } catch (error) {
    console.error("API 요청 실패:", error);

    // 네트워크 오류 시 오래된 캐시라도 반환
    if (cachedResponse) {
      console.log("네트워크 실패로 오래된 캐시 반환:", request.url);
      return cachedResponse;
    }

    throw error;
  }
}

// 캐시 정리
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
