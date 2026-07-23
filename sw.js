const CACHE_NAME = 'buku-kas-aul-v2';
// Daftarkan semua file utama Anda di sini agar bisa diakses offline
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './loogo-192.png',
  './loogo-512.png'
];

// Tahap Install: Menyimpan file ke dalam cache
self.addEventListener('install', (event) => {
  self.skipWaiting(); // langsung aktifkan versi baru, tidak menunggu semua tab ditutup
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Tahap Aktivasi: Membersihkan cache lama jika ada pembaruan
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // langsung ambil alih semua tab yang terbuka
  );
});

// Tahap Fetch: Mengambil data dari cache jika offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
