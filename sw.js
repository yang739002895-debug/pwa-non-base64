const CACHE_NAME = 'nonbase64-pwa-v1'; // 本公司横版（底板 3840×2160，4K 输出即 3840×2160）；缓存优先，每次改文件都必须改这个版本号
// v1: 整套 UI 换成「格丽诗方 v3.10」那套外壳（预览区按钮下移 + 竖排文件名 + 并排折叠面板 + 一行式底栏）。
//     ★ 缓存前缀特意用 'nonbase64-pwa-'：'gelishi-pwa-' 是竖版请柬那套的，
//       两者可能部署在同一个 GitHub Pages 源（同源共享 Cache Storage），前缀必须区分开。
const urlsToCache = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './back.png',
  './FZXiaoBiaoSong-B05S.woff2'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      // 只清自己这套缓存：caches.keys() 是整个源的，全清会顺手删掉同源其它
      // 版本（比如竖版「格丽诗方」）的离线缓存
      keys.filter(k => k.indexOf('nonbase64-pwa-') === 0 && k !== CACHE_NAME)
          .map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
