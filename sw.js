const CACHE_NAME = 'renovados-v2'; // Incrementamos la versión para forzar la actualización
const urlsToCache = [
  '/',
  '/index.html',
  '/galeria.html',
  '/styles.css',
  '/script.js',
  '/pwa.js',
  '/manifest.json',
  '/img/logo.png',
  '/img/logo 1.jpg',
  '/img/barberia.jpg',
  '/img/barbero.jpg',
  '/img/00001.jpg',
  '/img/mapa.png',
  '/img/icon-192.png',
  '/img/icon-512.png'
  // Se cachearán automáticamente otros recursos cuando se soliciten
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
  // Forzar la activación inmediata
  self.skipWaiting();
});

// Activación del Service Worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Tomar el control de todas las páginas inmediatamente
      return self.clients.claim();
    })
  );
});

// Estrategia de caché: Network first, falling back to cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Si la respuesta es válida, clonarla y guardarla en caché
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
        }
        return response;
      })
      .catch(() => {
        // Si la red falla, intentar servir desde caché
        return caches.match(event.request);
      })
  );
});

// Evento para mostrar notificaciones push
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'Nuevas ofertas y promociones disponibles',
      icon: '/img/logo 1.jpg',
      badge: '/img/logo 1.jpg',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '1'
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Barbería Renovados', options)
    );
  }
});

// Evento para manejar clics en notificaciones
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});