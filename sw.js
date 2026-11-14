// service worker ขั้นต่ำ เพื่อให้มือถือยอมให้ "ติดตั้งแอป"
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
