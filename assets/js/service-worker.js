// service-worker.js
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('my-pwa-cache-v1').then(function(cache) {
            return cache.addAll([
                '/jvkj/',
                '/jvkj/index.html',
                '/jvkj/muffini_coko.html',
                '/jvkj/palacinke_ameriske.html',
                '/jvkj/brst_oh_gorcicna.html',
                '/jvkj/test_brokoli_pisc.html',
                '/jvkj/medenjaki.jpeg',
                '/jvkj/images/palacinke_ameriske.jpeg',
                '/jvkj/images/muffini_coko.jpeg',
                '/jvkj/images/brst_oh_gorcicna.jpeg',
                '/jvkj/test_brokoli_pisc.jpeg',
                '/jvkj/images/medenjaki.jpeg',
                '/jvkj/images/cookbook3.jpeg',
                '/jvkj/assets/css/fontawesome-all.min.css',
                '/jvkj/assets/css/main.css',
                '/jvkj/assets/js/breakpoints.min.js',
                '/jvkj/assets/js/browser.min.js',
                '/jvkj/assets/js/custom.js',
                '/jvkj/assets/js/jquery.min.js',
                '/jvkj/assets/js/main.js',
                '/jvkj/assets/js/sidebar.js',
                '/jvkj/assets/js/util.js',
                '/jvkj/assets/webfonts/fa-brands-400.eot',
                '/jvkj/assets/webfonts/fa-brands-400.svg',
                '/jvkj/assets/webfonts/fa-brands-400.ttf',
                '/jvkj/assets/webfonts/fa-brands-400.woff',
                '/jvkj/assets/webfonts/fa-brands-400.woff2',
                '/jvkj/assets/webfonts/fa-regular-400.eot',
                '/jvkj/assets/webfonts/fa-regular-400.svg',
                '/jvkj/assets/webfonts/fa-regular-400.ttf',
                '/jvkj/assets/webfonts/fa-regular-400.woff',
                '/jvkj/assets/webfonts/fa-regular-400.woff2',
                '/jvkj/assets/webfonts/fa-solid-900.eot',
                '/jvkj/assets/webfonts/fa-solid-900.svg',
                '/jvkj/assets/webfonts/fa-solid-900.ttf',
                '/jvkj/assets/webfonts/fa-solid-900.woff',
                '/jvkj/assets/webfonts/fa-solid-900.woff2',
                '/jvkj/images/icon.png',
                '/jvkj/images/icon-512.png',
                // Add other assets you want to cache
            ]);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});