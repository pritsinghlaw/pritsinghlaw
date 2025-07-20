/**
 * Website Performance Optimization Script
 * For: pritsinghlaw.com
 * 
 * Features:
 * - Smooth scrolling implementation
 * - Lazy loading for images with intersection observer
 * - Client-side image compression
 * - Critical resource preloading
 * - Service worker for caching
 * - Minification and concatenation utilities
 * - Core Web Vitals optimization
 */

class WebsiteOptimizer {
    constructor() {
        this.init();
    }

    init() {
        // Initialize all optimization features when DOM is loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initOptimizations();
            });
        } else {
            this.initOptimizations();
        }
    }

    initOptimizations() {
        console.log('🚀 Initializing website performance optimizations...');

        // 1. Implement smooth scrolling
        this.initSmoothScrolling();

        // 2. Setup lazy loading for images
        this.initLazyLoading();

        // 3. Preload critical resources
        this.preloadCriticalResources();

        // 4. Initialize service worker
        this.initServiceWorker();

        // 5. Optimize images on upload
        this.initImageOptimization();

        // 6. Setup performance monitoring
        this.initPerformanceMonitoring();

        // 7. Implement intersection observer for animations
        this.initScrollAnimations();

        // 8. Defer non-critical resources
        this.deferNonCriticalResources();

        console.log('✅ All optimizations initialized successfully!');
    }

    // 1. SMOOTH SCROLLING IMPLEMENTATION
    initSmoothScrolling() {
        // Add CSS smooth scrolling with fallback
        const style = document.createElement('style');
        style.textContent = `
            html {
                scroll-behavior: smooth;
            }

            /* Fallback for browsers that don't support smooth scrolling */
            @media (prefers-reduced-motion: no-preference) {
                html:focus-within {
                    scroll-behavior: smooth;
                }
            }
        `;
        document.head.appendChild(style);

        // JavaScript fallback for older browsers
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a[href^="#"]');
            if (!target) return;

            const targetId = target.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();

                // Use native scrollIntoView with smooth behavior
                if ('scrollBehavior' in document.documentElement.style) {
                    targetElement.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                } else {
                    // Custom smooth scroll for older browsers
                    this.smoothScrollTo(targetElement.offsetTop, 800);
                }
            }
        });

        // Add smooth scroll to top functionality
        this.addScrollToTop();
    }

    smoothScrollTo(targetPosition, duration = 500) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };

        requestAnimationFrame(animation);
    }

    easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    addScrollToTop() {
        // Create scroll to top button
        const scrollButton = document.createElement('button');
        scrollButton.innerHTML = '↑';
        scrollButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: none;
            background: #333;
            color: white;
            font-size: 20px;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s, visibility 0.3s;
            z-index: 1000;
        `;

        document.body.appendChild(scrollButton);

        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollButton.style.opacity = '1';
                scrollButton.style.visibility = 'visible';
            } else {
                scrollButton.style.opacity = '0';
                scrollButton.style.visibility = 'hidden';
            }
        });

        // Scroll to top on click
        scrollButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 2. LAZY LOADING WITH INTERSECTION OBSERVER
    initLazyLoading() {
        // Lazy load images
        this.lazyLoadImages();

        // Lazy load background images
        this.lazyLoadBackgroundImages();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        if (images.length === 0) return;

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;

                    // Create a new image to preload
                    const newImg = new Image();
                    newImg.onload = () => {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        if (img.dataset.srcset) {
                            img.srcset = img.dataset.srcset;
                        }
                    };
                    newImg.src = img.dataset.src;

                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        images.forEach(img => {
            // Add loading placeholder
            img.style.backgroundColor = '#f0f0f0';
            imageObserver.observe(img);
        });

        // Add CSS for smooth image loading
        const lazyStyle = document.createElement('style');
        lazyStyle.textContent = `
            img[data-src] {
                opacity: 0;
                transition: opacity 0.3s;
            }
            img.loaded {
                opacity: 1;
            }
        `;
        document.head.appendChild(lazyStyle);
    }

    lazyLoadBackgroundImages() {
        const bgElements = document.querySelectorAll('[data-bg]');
        if (bgElements.length === 0) return;

        const bgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    element.style.backgroundImage = `url(${element.dataset.bg})`;
                    element.classList.add('bg-loaded');
                    observer.unobserve(element);
                }
            });
        }, {
            rootMargin: '50px 0px'
        });

        bgElements.forEach(el => bgObserver.observe(el));
    }

    // 3. CRITICAL RESOURCE PRELOADING
    preloadCriticalResources() {
        const criticalResources = [
            // Add your critical resources here
            '/css/style.css',
            '/js/main.js',
            // Web fonts
            'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';

            if (resource.endsWith('.css')) {
                link.as = 'style';
                link.onload = () => {
                    link.rel = 'stylesheet';
                };
            } else if (resource.endsWith('.js')) {
                link.as = 'script';
            } else if (resource.includes('font')) {
                link.as = 'style';
                link.crossOrigin = 'anonymous';
            }

            link.href = resource;
            document.head.appendChild(link);
        });

        // Preconnect to external domains
        const externalDomains = [
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com',
            'https://www.google-analytics.com'
        ];

        externalDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = domain;
            document.head.appendChild(link);
        });
    }

    // 4. SERVICE WORKER FOR CACHING
    async initServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered successfully:', registration);

                // Listen for service worker updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New service worker is available
                            this.showUpdateNotification();
                        }
                    });
                });
            } catch (error) {
                console.log('Service Worker registration failed:', error);
            }
        }
    }

    showUpdateNotification() {
        // Show update notification to user
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #333;
            color: white;
            padding: 15px;
            border-radius: 5px;
            z-index: 10000;
        `;
        notification.innerHTML = `
            <p>A new version is available!</p>
            <button onclick="window.location.reload()" style="background: #007cba; color: white; border: none; padding: 5px 10px; border-radius: 3px; margin-top: 10px;">Update</button>
        `;
        document.body.appendChild(notification);

        // Auto remove after 10 seconds
        setTimeout(() => notification.remove(), 10000);
    }

    // 5. CLIENT-SIDE IMAGE COMPRESSION
    initImageOptimization() {
        const fileInputs = document.querySelectorAll('input[type="file"][accept*="image"]');

        fileInputs.forEach(input => {
            input.addEventListener('change', async (e) => {
                const files = Array.from(e.target.files);
                const compressedFiles = await Promise.all(
                    files.map(file => this.compressImage(file))
                );

                // Replace original files with compressed ones
                const dt = new DataTransfer();
                compressedFiles.forEach(file => dt.items.add(file));
                input.files = dt.files;
            });
        });
    }

    async compressImage(file, maxWidth = 1920, maxHeight = 1080, quality = 0.8) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                // Calculate new dimensions
                let { width, height } = img;

                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                if (height > maxHeight) {
                    width = (width * maxHeight) / height;
                    height = maxHeight;
                }

                canvas.width = width;
                canvas.height = height;

                // Draw and compress
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    const compressedFile = new File([blob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    });

                    console.log(`Compressed ${file.name}: ${(file.size / 1024).toFixed(1)}KB → ${(blob.size / 1024).toFixed(1)}KB`);
                    resolve(compressedFile);
                }, 'image/jpeg', quality);
            };

            img.src = URL.createObjectURL(file);
        });
    }

    // 6. PERFORMANCE MONITORING
    initPerformanceMonitoring() {
        // Monitor Core Web Vitals
        this.monitorCoreWebVitals();

        // Monitor page load performance
        this.monitorPageLoad();
    }

    monitorCoreWebVitals() {
        // LCP (Largest Contentful Paint)
        if ('PerformanceObserver' in window) {
            try {
                const lcpObserver = new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    console.log('LCP:', lastEntry.startTime);
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

                // CLS (Cumulative Layout Shift)
                const clsObserver = new PerformanceObserver((entryList) => {
                    let clsValue = 0;
                    for (const entry of entryList.getEntries()) {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    }
                    console.log('CLS:', clsValue);
                });
                clsObserver.observe({ entryTypes: ['layout-shift'] });

            } catch (e) {
                console.log('Performance monitoring not available in this browser');
            }
        }
    }

    monitorPageLoad() {
        window.addEventListener('load', () => {
            const perfData = performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            const domContentLoaded = perfData.domContentLoadedEventEnd - perfData.navigationStart;

            console.log(`Page Load Time: ${pageLoadTime}ms`);
            console.log(`DOM Content Loaded: ${domContentLoaded}ms`);

            // Send to analytics (replace with your analytics code)
            // gtag('event', 'timing_complete', {
            //     'name': 'load',
            //     'value': pageLoadTime
            // });
        });
    }

    // 7. SCROLL ANIMATIONS
    initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .slide-in-left, .slide-in-right');

        if (animatedElements.length === 0) return;

        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    // Optionally unobserve after animation
                    // animationObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => animationObserver.observe(el));

        // Add CSS for animations
        const animationStyle = document.createElement('style');
        animationStyle.textContent = `
            .fade-in {
                opacity: 0;
                transition: opacity 0.6s ease-in-out;
            }
            .fade-in.animate {
                opacity: 1;
            }

            .slide-up {
                transform: translateY(30px);
                opacity: 0;
                transition: transform 0.6s ease-out, opacity 0.6s ease-out;
            }
            .slide-up.animate {
                transform: translateY(0);
                opacity: 1;
            }

            .slide-in-left {
                transform: translateX(-30px);
                opacity: 0;
                transition: transform 0.6s ease-out, opacity 0.6s ease-out;
            }
            .slide-in-left.animate {
                transform: translateX(0);
                opacity: 1;
            }

            .slide-in-right {
                transform: translateX(30px);
                opacity: 0;
                transition: transform 0.6s ease-out, opacity 0.6s ease-out;
            }
            .slide-in-right.animate {
                transform: translateX(0);
                opacity: 1;
            }
        `;
        document.head.appendChild(animationStyle);
    }

    // 8. DEFER NON-CRITICAL RESOURCES
    deferNonCriticalResources() {
        // Defer analytics scripts
        this.deferAnalytics();

        // Defer social media widgets
        this.deferSocialWidgets();

        // Defer non-critical CSS
        this.deferNonCriticalCSS();
    }

    deferAnalytics() {
        // Defer Google Analytics loading
        window.addEventListener('load', () => {
            setTimeout(() => {
                if (window.gtag) return; // Already loaded

                const script = document.createElement('script');
                script.async = true;
                script.src = 'https://www.googletagmanager.com/gtag/js?id=YOUR-GA-ID';
                document.head.appendChild(script);

                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'YOUR-GA-ID');
            }, 3000);
        });
    }

    deferSocialWidgets() {
        // Defer social media widgets until user interaction
        const socialPlaceholders = document.querySelectorAll('.social-widget-placeholder');

        socialPlaceholders.forEach(placeholder => {
            placeholder.addEventListener('click', () => {
                this.loadSocialWidget(placeholder);
            }, { once: true });
        });
    }

    loadSocialWidget(placeholder) {
        // Load actual social widget
        const widgetType = placeholder.dataset.widget;

        if (widgetType === 'twitter') {
            // Load Twitter widget
            const script = document.createElement('script');
            script.src = 'https://platform.twitter.com/widgets.js';
            document.head.appendChild(script);
        }
        // Add other social widgets as needed
    }

    deferNonCriticalCSS() {
        // Load non-critical CSS after page load
        window.addEventListener('load', () => {
            const nonCriticalCSS = [
                '/css/animations.css',
                '/css/print.css'
            ];

            nonCriticalCSS.forEach(css => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = css;
                document.head.appendChild(link);
            });
        });
    }

    // UTILITY METHODS

    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function for scroll events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}

// Initialize the optimizer
new WebsiteOptimizer();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WebsiteOptimizer;
}
