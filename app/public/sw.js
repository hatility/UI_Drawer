// UI Drawer 오프라인 지원: 한 번 열어 본 파일은 저장해 두었다가, 인터넷이 끊기면 그걸로 보여 줘요.
// 늘 새 파일을 먼저 받아 보고(네트워크 먼저), 안 되면 저장해 둔 것을 써요.
const CACHE = 'ui-drawer-v0.5.0'
self.addEventListener('install', (e) => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['./', './index.html', './favicon.svg']))) })
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())) })
self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return
  e.respondWith(fetch(req).then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); return res }).catch(() => caches.match(req).then((r) => r || caches.match('./index.html'))))
})
