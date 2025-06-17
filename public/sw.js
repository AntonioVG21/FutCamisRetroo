// Service Worker para optimización de imágenes y caché

const CACHE_NAME = 'futcamisretros-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/index.css',
];

// Estrategia de caché para imágenes: Cache First, luego Network
const IMAGES_CACHE = 'images-cache-v1';

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return (
              cacheName.startsWith('futcamisretros-cache-') && cacheName !== CACHE_NAME
            );
          })
          .map((cacheName) => {
            return caches.delete(cacheName);
          })
      );
    })
  );
});

// Interceptar peticiones
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  
  // Estrategia para imágenes: Cache First, luego Network
  if (
    event.request.method === 'GET' &&
    event.request.destination === 'image'
  ) {
    event.respondWith(
      caches.open(IMAGES_CACHE).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          // Si está en caché, devolver la respuesta cacheada
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Si no está en caché, hacer la petición a la red
          return fetch(event.request).then((networkResponse) => {
            // Clonar la respuesta para poder almacenarla en caché
            const clonedResponse = networkResponse.clone();
            
            // Almacenar en caché
            cache.put(event.request, clonedResponse);
            
            return networkResponse;
          });
        });
      })
    );
    return;
  }
  
  // Estrategia para otros recursos: Network First, luego Cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la respuesta es válida, clonarla y almacenarla en caché
        if (response && response.status === 200) {
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
        }
        return response;
      })
      .catch(() => {
        // Si falla la red, intentar recuperar de caché
        return caches.match(event.request);
      })
  );
});

// Precarga de imágenes
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PRECACHE_IMAGES') {
    const imageUrls = event.data.imageUrls;
    
    if (Array.isArray(imageUrls) && imageUrls.length > 0) {
      caches.open(IMAGES_CACHE).then((cache) => {
        imageUrls.forEach((imageUrl) => {
          fetch(imageUrl, { mode: 'no-cors' })
            .then((response) => {
              if (response.ok) {
                cache.put(imageUrl, response);
              }
            })
            .catch(() => {
              // Ignorar errores de precarga
            });
        });
      });
    }
  }
});