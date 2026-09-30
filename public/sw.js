self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data ? event.data.text() : '' };
  }

  const title = data.title || 'TaalumaWorld';
  const body = data.body || data.message || data.msg || '';
  const url = data.url || data.link || '/';
  const tag = typeof data.tag === 'string' ? data.tag.trim() : '';

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/images/logo.webp',
      data: { url },
      ...(tag ? { tag, renotify: data.renotify === true } : {}),
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(self.clients.openWindow(url));
});
