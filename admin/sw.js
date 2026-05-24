/* Service worker admin — cache léger + notifications push */
const CACHE = 'dc-admin-v2';

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then((c) =>
      c.addAll(['index.php', 'manifest.json', 'assets/admin-shell.js']).catch(() => {})
    )
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});

self.addEventListener('push', (e) => {
  let data = { title: 'Donchaminade Admin', body: 'Nouvelle activité', url: 'index.php' };
  try {
    if (e.data) {
      data = { ...data, ...e.data.json() };
    }
  } catch (_) {}

  const options = {
    body: data.body || '',
    icon: data.icon || '../public/favicon.png',
    badge: '../public/favicon.png',
    data: { url: data.url || 'index.php' },
    vibrate: [120, 60, 120],
    tag: 'dc-admin-' + Date.now(),
    renotify: true,
  };

  e.waitUntil(self.registration.showNotification(data.title || 'Admin', options));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = e.notification.data?.url || 'index.php';
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if ('focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
    })
  );
});
