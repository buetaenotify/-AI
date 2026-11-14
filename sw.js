// รับของที่ "แชร์" มาจากแอปอื่น (Shopee / TikTok / แกลเลอรี) แล้วส่งต่อให้หน้าแอป
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'POST' || !u.pathname.endsWith('/share')) return;
  e.respondWith((async () => {
    try {
      const fd = await e.request.formData();
      const files = fd.getAll('images').filter(f => f && f.size).slice(0, 2);
      const cache = await caches.open('share');
      await cache.put('meta', new Response(JSON.stringify({
        title: fd.get('title') || '', text: fd.get('text') || '', url: fd.get('url') || '', n: files.length })));
      for (let i = 0; i < files.length; i++) {
        await cache.put('img' + i, new Response(files[i], { headers: { 'Content-Type': files[i].type || 'image/jpeg' } }));
      }
    } catch (err) { /* เปิดแอปเปล่า ๆ ถ้าอ่านไม่ได้ */ }
    return Response.redirect(new URL('./index.html?shared=1', self.location).href, 303);
  })());
});
