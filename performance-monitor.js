
// Performance monitoring script for Core Web Vitals
(function() {
    'use strict';

    // Check if Performance Observer is supported
    if (!('PerformanceObserver' in window)) {
        console.warn('PerformanceObserver not supported');
        return;
    }

    // Monitor Largest Contentful Paint (LCP)
    function observeLCP() {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            
            console.log('LCP:', Math.round(lastEntry.startTime));
            
            // Track in analytics if available
            if (typeof gtag === 'function') {
                gtag('event', 'LCP', {
                    custom_parameter: Math.round(lastEntry.startTime)
                });
            }
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }

    // Monitor First Input Delay (FID)
    function observeFID() {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                console.log('FID:', Math.round(entry.processingStart - entry.startTime));
                
                if (typeof gtag === 'function') {
                    gtag('event', 'FID', {
                        custom_parameter: Math.round(entry.processingStart - entry.startTime)
                    });
                }
            });
        });
        
        observer.observe({ entryTypes: ['first-input'] });
    }

    // Monitor Cumulative Layout Shift (CLS)
    function observeCLS() {
        let clsValue = 0;
        let clsEntries = [];
        
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    const firstSessionEntry = clsEntries[0];
                    const lastSessionEntry = clsEntries[clsEntries.length - 1];
                    
                    if (!firstSessionEntry || entry.startTime - lastSessionEntry.startTime < 1000) {
                        clsEntries.push(entry);
                        clsValue += entry.value;
                    }
                }
            });
            
            console.log('CLS:', clsValue.toFixed(4));
        });
        
        observer.observe({ entryTypes: ['layout-shift'] });
    }

    // Initialize monitoring when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            observeLCP();
            observeFID();
            observeCLS();
        });
    } else {
        observeLCP();
        observeFID();
        observeCLS();
    }

    // Monitor resource loading performance
    window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0];
        
        // Disable performance logs in production
        // console.log('Page Load Metrics:', {
        //     'DNS Lookup': Math.round(navigation.domainLookupEnd - navigation.domainLookupStart),
        //     'TCP Handshake': Math.round(navigation.connectEnd - navigation.connectStart),
        //     'Request': Math.round(navigation.responseStart - navigation.requestStart),
        //     'Response': Math.round(navigation.responseEnd - navigation.responseStart),
        //     'DOM Processing': Math.round(navigation.domContentLoadedEventEnd - navigation.responseEnd),
        //     'Total Load Time': Math.round(navigation.loadEventEnd - navigation.navigationStart)
        // });
    });

    // Image loading optimization
    function optimizeImages() {
        const images = document.querySelectorAll('img[data-src], img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }

    // Initialize image optimization
    document.addEventListener('DOMContentLoaded', optimizeImages);
})();
