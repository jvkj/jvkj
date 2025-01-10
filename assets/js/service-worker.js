// service-worker.js
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('my-pwa-cache-v1').then(function(cache) {
            return cache.addAll([
                '/',
                '/index.html',
                '/muffini_coko.html',
                '/palacinke_ameriske.html',
                '/images/am_pancakes.jpeg',
                '/images/choco-muffin.jpeg',
                '/images/cookbook3.jpeg',
                '/assets/css/fontawesome-all.min.css',
                '/assets/css/main.css',
                '/assets/js/breakpoints.min.js',
                '/assets/js/browser.min.js',
                '/assets/js/custom.js',
                '/assets/js/jquery.min.js',
                '/assets/js/main.js',
                '/assets/js/sidebar.js',
                '/assets/js/util.js',
                '/assets/webfonts/fa-brands-400.eot',
                '/assets/webfonts/fa-brands-400.svg',
                '/assets/webfonts/fa-brands-400.ttf',
                '/assets/webfonts/fa-brands-400.woff',
                '/assets/webfonts/fa-brands-400.woff2',
                '/assets/webfonts/fa-regular-400.eot',
                '/assets/webfonts/fa-regular-400.svg',
                '/assets/webfonts/fa-regular-400.ttf',
                '/assets/webfonts/fa-regular-400.woff',
                '/assets/webfonts/fa-regular-400.woff2',
                '/assets/webfonts/fa-solid-900.eot',
                '/assets/webfonts/fa-solid-900.svg',
                '/assets/webfonts/fa-solid-900.ttf',
                '/assets/webfonts/fa-solid-900.woff',
                '/assets/webfonts/fa-solid-900.woff2',
                '/images/icon.png',
                '/images/icon-512.png',
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
