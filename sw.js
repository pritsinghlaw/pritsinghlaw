/**
 * Service Worker for Website Performance Optimization
 * Handles caching strategies for optimal performance
 */

const CACHE_NAME = 'pritsinghlaw-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';
const IMAGE_CACHE = 'images-v1.0.0';

// Assets to cache immediately on install
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/about/',
    '/services/',
    '/css/style.css',
    '/js/website-performance-optimizer.js',
    '/favicon.ico',
    // Add your critical assets here
];

// Install event - cache static assets
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');

    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .catch(error => {
                console.log('Service Worker: Error caching static assets:', error);
            })
    );

    // Force activation of new service worker
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');

    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cache => {
                        // Delete old caches
                        if (cache !== STATIC_CACHE && cache !== DYNAMIC_CACHE && cache !== IMAGE_CACHE) {
                            console.log('Service Worker: Deleting old cache:', cache);
                            return caches.delete(cache);
                        }
                    })
                );
            })
            .then(() => {
                return self.clients.claim();
            })
    );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip cross-origin requests (except for fonts and images)
    if (url.origin !== location.origin && 
        !request.url.includes('fonts.googleapis.com') &&
        !request.url.includes('fonts.gstatic.com') &&
        !isImageRequest(request)) {
        return;
    }

    // Apply different strategies based on request type
    if (isImageRequest(request)) {
        event.respondWith(handleImageRequest(request));
    } else if (isStaticAsset(request)) {
        event.respondWith(handleStaticAsset(request));
    } else if (isHTMLRequest(request)) {
        event.respondWith(handleHTMLRequest(request));
    } else {
        event.respondWith(handleOtherRequests(request));
    }
});

// CACHING STRATEGIES

// 1. Cache First (for images) - good for static assets
async function handleImageRequest(request) {
    try {
        const cache = await caches.open(IMAGE_CACHE);
        const cachedResponse = await cache.match(request);

        if (cachedResponse) {
            // Return cached version immediately
            return cachedResponse;
        }

        // Fetch from network and cache
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
            // Cache successful responses
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.log('Service Worker: Image request failed:', error);
        // Return offline fallback image if available
        return caches.match('/images/offline-placeholder.jpg');
    }
}

// 2. Stale While Revalidate (for CSS/JS) - balance between speed and freshness
async function handleStaticAsset(request) {
    try {
        const cache = await caches.open(STATIC_CACHE);
        const cachedResponse = await cache.match(request);

        // Fetch fresh version in background
        const fetchPromise = fetch(request).then(networkResponse => {
            if (networkResponse.ok) {
                cache.put(request, networkResponse.clone());
            }
            return networkResponse;
        });

        // Return cached version immediately if available
        return cachedResponse || fetchPromise;
    } catch (error) {
        console.log('Service Worker: Static asset request failed:', error);
        return caches.match('/offline.html');
    }
}

// 3. Network First (for HTML) - prioritize fresh content
async function handleHTMLRequest(request) {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);

        try {
            // Try network first
            const networkResponse = await fetch(request);

            if (networkResponse.ok) {
                // Cache successful responses
                cache.put(request, networkResponse.clone());
                return networkResponse;
            }
        } catch (networkError) {
            console.log('Service Worker: Network failed, trying cache');
        }

        // Fall back to cache
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        // Final fallback - offline page
        return caches.match('/offline.html') || new Response(
            '<html><body><h1>Offline</h1><p>Please check your internet connection.</p></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
        );

    } catch (error) {
        console.log('Service Worker: HTML request failed:', error);
        return new Response('Service temporarily unavailable', { status: 503 });
    }
}

// 4. Cache First with Network Fallback (for other requests)
async function handleOtherRequests(request) {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        const cachedResponse = await cache.match(request);

        if (cachedResponse) {
            return cachedResponse;
        }

        // Fetch from network and cache
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.log('Service Worker: Other request failed:', error);
        return new Response('Request failed', { status: 500 });
    }
}

// HELPER FUNCTIONS

function isImageRequest(request) {
    return request.destination === 'image' || 
           /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(new URL(request.url).pathname);
}

function isStaticAsset(request) {
    return request.destination === 'style' || 
           request.destination === 'script' ||
           request.destination === 'font' ||
           /\.(css|js|woff|woff2|ttf|eot)$/i.test(new URL(request.url).pathname);
}

function isHTMLRequest(request) {
    return request.destination === 'document' ||
           request.headers.get('Accept')?.includes('text/html');
}

// BACKGROUND SYNC (if supported)
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    console.log('Service Worker: Background sync triggered');
    // Implement background sync logic here
    // e.g., sync offline form submissions, update cache, etc.
}

// PUSH NOTIFICATIONS (if needed)
self.addEventListener('push', event => {
    if (!event.data) return;

    const data = event.data.json();
    const options = {
        body: data.body,
        icon: '/images/notification-icon.png',
        badge: '/images/notification-badge.png',
        data: data.url
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();

    if (event.notification.data) {
        event.waitUntil(
            clients.openWindow(event.notification.data)
        );
    }
});

// CACHE MANAGEMENT

// Clean up old cache entries periodically
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'CLEAN_CACHE') {
        event.waitUntil(cleanupCache());
    }
});

async function cleanupCache() {
    const cacheNames = await caches.keys();
    const cachePromises = cacheNames.map(async cacheName => {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();

        // Remove entries older than 30 days
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);

        return Promise.all(
            requests.map(async request => {
                const response = await cache.match(request);
                const dateHeader = response.headers.get('date');

                if (dateHeader) {
                    const responseDate = new Date(dateHeader).getTime();
                    if (responseDate < thirtyDaysAgo) {
                        return cache.delete(request);
                    }
                }
            })
        );
    });

    await Promise.all(cachePromises);
    console.log('Service Worker: Cache cleanup completed');
}

// OFFLINE ANALYTICS
self.addEventListener('fetch', event => {
    // Track offline usage
    if (!navigator.onLine) {
        const url = new URL(event.request.url);
        console.log('Service Worker: Offline request:', url.pathname);

        // Store offline analytics data
        storeOfflineAnalytics({
            url: url.pathname,
            timestamp: Date.now(),
            userAgent: navigator.userAgent
        });
    }
});

async function storeOfflineAnalytics(data) {
    try {
        // Store in IndexedDB for later transmission
        const db = await openDB('analytics', 1, {
            upgrade(db) {
                db.createObjectStore('offline-events', { keyPath: 'timestamp' });
            }
        });

        const tx = db.transaction('offline-events', 'readwrite');
        await tx.objectStore('offline-events').add(data);
        await tx.done;
    } catch (error) {
        console.log('Service Worker: Failed to store offline analytics:', error);
    }
}

// Simple IndexedDB helper
function openDB(name, version, { upgrade }) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(name, version);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        request.onupgradeneeded = () => upgrade(request.result);
    });
}

console.log('Service Worker: Script loaded successfully');
