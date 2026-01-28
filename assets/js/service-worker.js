// service-worker.js
const BASE_PATH = '/jvkj';  // Change this if repo name changes

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('my-pwa-cache-v2').then(function(cache) {
            return cache.addAll([
                `${BASE_PATH}/`,
                `${BASE_PATH}/index.html`,
                `${BASE_PATH}/muffini_coko.html`,
                `${BASE_PATH}/palacinke_ameriske.html`,
                `${BASE_PATH}/brst_oh_gorcicna.html`,
                `${BASE_PATH}/test_brokoli_pisc.html`,
                `${BASE_PATH}/medenjaki.html`,
                `${BASE_PATH}/images/palacinke_ameriske.jpeg`,
                `${BASE_PATH}/images/muffini_coko.jpeg`,
                `${BASE_PATH}/images/brst_oh_gorcicna.jpeg`,
                `${BASE_PATH}/images/test_brokoli_pisc.jpeg`,
                `${BASE_PATH}/images/medenjaki.jpeg`,
                `${BASE_PATH}/images/zacimbe_medenjaki.jpeg`,
                `${BASE_PATH}/images/cookbook3.jpeg`,
                `${BASE_PATH}/images/icon.png`,
                `${BASE_PATH}/images/icon-512.png`,
                `${BASE_PATH}/assets/css/fontawesome-all.min.css`,
                `${BASE_PATH}/assets/css/main.css`,
                `${BASE_PATH}/assets/js/articles.js`,
                `${BASE_PATH}/assets/js/breakpoints.min.js`,
                `${BASE_PATH}/assets/js/browser.min.js`,
                `${BASE_PATH}/assets/js/custom.js`,
                `${BASE_PATH}/assets/js/jquery.min.js`,
                `${BASE_PATH}/assets/js/main.js`,
                `${BASE_PATH}/assets/js/sidebar.js`,
                `${BASE_PATH}/assets/js/util.js`,
                `${BASE_PATH}/assets/webfonts/fa-brands-400.eot`,
                `${BASE_PATH}/assets/webfonts/fa-brands-400.svg`,
                `${BASE_PATH}/assets/webfonts/fa-brands-400.ttf`,
                `${BASE_PATH}/assets/webfonts/fa-brands-400.woff`,
                `${BASE_PATH}/assets/webfonts/fa-brands-400.woff2`,
                `${BASE_PATH}/assets/webfonts/fa-regular-400.eot`,
                `${BASE_PATH}/assets/webfonts/fa-regular-400.svg`,
                `${BASE_PATH}/assets/webfonts/fa-regular-400.ttf`,
                `${BASE_PATH}/assets/webfonts/fa-regular-400.woff`,
                `${BASE_PATH}/assets/webfonts/fa-regular-400.woff2`,
                `${BASE_PATH}/assets/webfonts/fa-solid-900.eot`,
                `${BASE_PATH}/assets/webfonts/fa-solid-900.svg`,
                `${BASE_PATH}/assets/webfonts/fa-solid-900.ttf`,
                `${BASE_PATH}/assets/webfonts/fa-solid-900.woff`,
                `${BASE_PATH}/assets/webfonts/fa-solid-900.woff2`,
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
