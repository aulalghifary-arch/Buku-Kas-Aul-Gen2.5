const CACHE_NAME = 'buku-kas-aul-v7'; // naikkan tiap kali ada update
// Daftarkan semua file utama Anda di sini agar bisa diakses offline
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './loogo-192.png',
  './loogo-512.png'
];

// File "app shell" -- HTML/CSS/JS inti yang PALING SERING berubah tiap
// update. Untuk file-file ini kita pakai strategi network-first (lihat
// fetch handler di bawah), supaya pengguna selalu dapat versi terbaru saat
// online, dan baru fallback ke cache kalau sedang offline.
const APP_SHELL_FILES = ['index.html', 'style.css', 'script.js'];

function isAppShellRequest(request){
  if (request.mode === 'navigate') return true; // buka/refresh halaman
  const path = new URL(request.url).pathname;
  const file = path.split('/').pop();
  return path.endsWith('/') || APP_SHELL_FILES.includes(file);
}

// Tahap Install: Menyimpan file ke dalam cache
self.addEventListener('install', (event) => {
  self.skipWaiting(); // langsung aktifkan versi baru, tidak menunggu semua tab ditutup
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // { cache: 'reload' } memaksa fetch ini melewati cache HTTP bawaan
      // browser/GitHub Pages, supaya yang tersimpan benar-benar versi
      // TERBARU dari server, bukan salinan lama yang kebetulan masih
      // dianggap "fresh" oleh browser.
      return Promise.all(
        ASSETS_TO_CACHE.map((url) =>
          fetch(url, { cache: 'reload' })
            .then((res) => cache.put(url, res))
            .catch(() => {}) // jangan sampai satu file gagal bikin install total gagal
        )
      );
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

// Tahap Fetch:
// - App shell (HTML/CSS/JS/navigasi) -> NETWORK-FIRST, fallback ke cache
//   kalau offline. Supaya perubahan kode SELALU langsung terlihat saat
//   online, tanpa perlu reload berkali-kali atau menunggu update SW.
// - Aset statis lain (logo, dst) -> CACHE-FIRST seperti sebelumnya, karena
//   jarang berubah dan lebih cepat diambil dari cache.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return; // biarkan request non-GET apa adanya

  if (isAppShellRequest(req)) {
    event.respondWith(
      fetch(req).then((res) => {
        if (res && res.ok) {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
        }
        return res;
      }).catch(() =>
        caches.match(req).then((cached) => cached || caches.match('./index.html'))
      )
    );
  } else {
    event.respondWith(
      caches.match(req).then((cachedResponse) => cachedResponse || fetch(req))
    );
  }
});
