# Create manifest.json for PWA
manifest_json = '''{
  "name": "Najoti Zamona",
  "short_name": "Najoti",
  "description": "Premium Futuristic Digital Experience",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#050510",
  "theme_color": "#00f0ff",
  "orientation": "portrait",
  "icons": [
    {
      "src": "assets/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "assets/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}'''

with open('/mnt/agents/output/najoti-zamona/assets/manifest.json', 'w') as f:
    f.write(manifest_json)

# Create favicon.svg
favicon_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#00f0ff"/>
      <stop offset="100%" style="stop-color:#bf00ff"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="20" fill="url(#g)"/>
  <text x="50" y="65" font-family="Arial, sans-serif" font-size="45" font-weight="bold" fill="white" text-anchor="middle">NZ</text>
</svg>'''

with open('/mnt/agents/output/najoti-zamona/assets/favicon.svg', 'w') as f:
    f.write(favicon_svg)

# Create service worker
sw_js = '''const CACHE_NAME = 'najoti-zamona-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/admin.html',
  '/admin.css',
  '/admin.js',
  '/assets/manifest.json',
  '/assets/favicon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response;
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
});'''

with open('/mnt/agents/output/najoti-zamona/assets/sw.js', 'w') as f:
    f.write(sw_js)

print("All asset files created successfully")
print("- manifest.json")
print("- favicon.svg")
print("- sw.js")
