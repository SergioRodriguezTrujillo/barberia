const CACHE_NAME = 'renovados-v3'; // Incrementamos la versión para forzar la actualización
const urlsToCache = [
  './',
  './index.html',
  './galeria.html',
  './styles.css',
  './script.js',
  './pwa.js',
  './manifest.json',
  './img/logo.png',
  './img/logo 1.jpg',
  './img/barberia.jpg',
  './img/barbero.jpg',
  './img/00001.jpg',
  './img/mapa.png',
  './img/icon-192.png',
  './img/icon-512.png'
  // Se cachearán automáticamente otros recursos cuando se soliciten
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cache abierto');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Todos los recursos han sido cacheados');
        return self.skipWaiting();
      })
  );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Activando...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Eliminando caché antigua', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Ahora está activo y controlando la página');
      return self.clients.claim();
    })
  );
});

// Estrategia de caché: Network first, falling back to cache
self.addEventListener('fetch', event => {
  console.log('Service Worker: Interceptando fetch', event.request.url);
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Si la respuesta es válida, clonarla y guardarla en caché
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              console.log('Service Worker: Guardando en caché', event.request.url);
              cache.put(event.request, responseToCache);
            });
        }
        return response;
      })
      .catch(() => {
        console.log('Service Worker: Fallback a caché para', event.request.url);
        return caches.match(event.request)
          .then(cachedResponse => {
            if (cachedResponse) {
              console.log('Service Worker: Sirviendo desde caché', event.request.url);
              return cachedResponse;
            }
            console.log('Service Worker: No se encontró en caché', event.request.url);
            // Si no está en caché, intentar con la página de inicio
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html');
            }
            return new Response('No se pudo cargar el recurso');
          });
      })
  );
});

// Evento para mostrar notificaciones push
self.addEventListener('push', event => {
  console.log('Service Worker: Evento push recibido');
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'Nuevas ofertas y promociones disponibles',
      icon: './img/logo 1.jpg',
      badge: './img/logo 1.jpg',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '1'
      }
    };
    
    console.log('Service Worker: Mostrando notificación');
    event.waitUntil(
      self.registration.showNotification(data.title || 'Barbería Renovados', options)
    );
  }
});

// Evento para manejar clics en notificaciones
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notificación clickeada');
  event.notification.close();
  event.waitUntil(
    clients.openWindow('./')
  );
});