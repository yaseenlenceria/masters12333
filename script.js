// Component Loading System
function loadComponent(componentPath, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`Container ${containerId} not found for component ${componentPath}`);
        return;
    }

    fetch(componentPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: Failed to load ${componentPath}`);
            }
            return response.text();
        })
        .then(data => {
            if (data && data.trim()) {
                container.innerHTML = data;

                // Execute any scripts in the loaded component
                const scripts = container.querySelectorAll('script');
                scripts.forEach(script => {
                    if (script.innerHTML.trim()) {
                        try {
                            eval(script.innerHTML);
                        } catch (scriptError) {
                            console.error(`Script error in ${componentPath}:`, scriptError);
                        }
                    }
                });

                console.log(`Successfully loaded component: ${componentPath}`);
            } else {
                console.warn(`Empty content returned for component: ${componentPath}`);
            }
        })
        .catch(error => {
            console.error(`Error loading component ${componentPath}:`, error.message);
            // Fallback content
            container.innerHTML = `<div style="padding: 2rem; text-align: center; color: #666;">
                <p>Content temporarily unavailable</p>
            </div>`;
        });
}

// Load all components on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, starting component loading...');

    // Load header and footer (always present)
    loadComponent('header.html', 'header-container');
    loadComponent('footer.html', 'footer-container');

    // Load page-specific components based on what containers exist
    const componentMappings = {
        'hero-container': 'components/hero-section.html',
        'benefits-container': 'components/benefits-banner.html',
        'services-container': 'components/services-overview.html',
        'why-choose-container': 'components/why-choose.html',
        'service-areas-container': 'components/service-areas.html',
        'gallery-container': 'components/gallery.html',
        'testimonials-container': 'components/testimonials.html',
        'process-container': 'components/process.html',
        'stats-container': 'components/stats.html',
        'faq-container': 'components/faq.html',
        'contact-cta-container': 'components/contact-cta.html'
    };

    // Load components that exist on the current page with error handling
    Object.entries(componentMappings).forEach(([containerId, componentPath]) => {
        const container = document.getElementById(containerId);
        if (container) {
            console.log(`Loading component ${componentPath} into ${containerId}`);
            loadComponent(componentPath, containerId);
        }
    });

    // Initialize other components after a short delay to ensure loading
    setTimeout(() => {
        initializeAnimations();
        initializeFormHandling();
        initializeSmoothScrolling();

        // Set body padding for fixed header
        const header = document.querySelector('.header');
        if (header) {
            document.body.style.paddingTop = header.offsetHeight + 'px';
        }

        // Initialize mobile menu and FAQ with extra delay
        ensureMobileMenuWorks();
        ensureFAQWorks();

        console.log('Component initialization complete');
    }, 500);
});

// Legacy function - kept for compatibility but not used with new components
function initializeNavigation() {
    // This function is no longer needed as navigation is handled within the header component
    console.log('Navigation initialized via header component');
}

// Set active navigation link based on current page
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    document.addEventListener('click', function(e) {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const target = document.querySelector(e.target.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
}

// Enhanced form submission handler
function initializeFormHandling() {
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            // Enhanced validation
            if (!validateForm(data)) {
                return;
            }

            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                alert('Thank you for your inquiry! We will contact you within 24 hours with your free quote.');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
}

// Form validation
function validateForm(data) {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'service', 'message'];
    const missingFields = [];

    requiredFields.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            missingFields.push(field);
        }
    });

    if (missingFields.length > 0) {
        alert('Please fill in all required fields: ' + missingFields.join(', '));
        return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('Please enter a valid email address.');
        return false;
    }

    // Phone validation (Irish format)
    const phoneRegex = /^(\+353|0)[0-9]{8,9}$/;
    if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
        alert('Please enter a valid Irish phone number.');
        return false;
    }

    return true;
}

// Animation initialization
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .feature-card, .contact-card, .testimonial-card, .gallery-item, .project-item');

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Enhanced Image Optimization and Lazy Loading
document.addEventListener('DOMContentLoaded', function() {
    // Mobile performance optimizations
    optimizeForMobile();

    // Preload critical images
    preloadCriticalImages();

    // Initialize optimized lazy loading
    initializeOptimizedLazyLoading();

    // Optimize all images
    optimizeAllImages();

    // Add loading states
    addImageLoadingStates();

    // Fix viewport issues
    fixViewportIssues();
});

// Mobile performance optimizations
function optimizeForMobile() {
    // Disable hover effects on touch devices
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');

        // Add CSS for touch devices
        const style = document.createElement('style');
        style.textContent = `
            .touch-device .service-card:hover,
            .touch-device .btn:hover,
            .touch-device .nav-link:hover {
                transform: none !important;
            }

            .touch-device .service-card:active,
            .touch-device .btn:active {
                transform: scale(0.95) !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Optimize scroll performance
    let ticking = false;
    function updateOnScroll() {
        // Throttle scroll events
        if (!ticking) {
            requestAnimationFrame(() => {
                // Add any scroll-based optimizations here
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', updateOnScroll, { passive: true });

    // Reduce motion for better performance
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--animation-duration', '0.01s');
    }
}

// Fix viewport issues
function fixViewportIssues() {
    // Prevent zoom on input focus for iOS
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        viewport.setAttribute('content', 
            'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
        );
    }

    // Fix 100vh issues on mobile
    function setVH() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    setVH();
    window.addEventListener('resize', setVH);
}

function preloadCriticalImages() {
    const criticalImages = [
        'attached_assets/mainlogo.png',
        'attached_assets/roof masters/roof masters logo.png',
        'attached_assets/dirtmasters/Dirtmasters-logo.png',
        'attached_assets/paintmasters/logo.png',
        'attached_assets/pavingmasters/Paving-Masters-Logo-e1750541386247.png',
        'attached_assets/roof masters/2000_67ab8ae4cd3b1.jpg'
    ];

    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    });
}

function initializeOptimizedLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading supported
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
        });
    } else {
        // Fallback intersection observer
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

function optimizeAllImages() {
    const allImages = document.querySelectorAll('img');

    allImages.forEach(img => {
        // Add loading optimization
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }

        // Add decoding async for better performance
        img.setAttribute('decoding', 'async');

        // Optimize src attribute for WebP support
        if (supportsWebP()) {
            optimizeImageFormat(img);
        }

        // Add error handling
        img.addEventListener('error', function() {
            console.warn('Failed to load image:', this.src);
            this.style.display = 'none';
        });

        // Add load event for performance tracking
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
    });
}

function supportsWebP() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('webp') > -1;
}

function optimizeImageFormat(img) {
    // This would typically involve server-side WebP generation
    // For now, we'll optimize loading behavior
    const originalSrc = img.src;

    // Add srcset for responsive images if not present
    if (!img.hasAttribute('srcset') && originalSrc.includes('attached_assets')) {
        // Create responsive breakpoints
        const baseSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '');
        const extension = originalSrc.match(/\.(jpg|jpeg|png)$/i)?.[0] || '.jpg';

        // Note: This assumes you have multiple sizes available
        // You would need to generate these on the server
        img.setAttribute('sizes', '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw');
    }
}

function addImageLoadingStates() {
    const images = document.querySelectorAll('img');

    images.forEach(img => {
        // Create placeholder
        const placeholder = document.createElement('div');
        placeholder.className = 'image-placeholder';
        placeholder.style.width = img.offsetWidth + 'px';
        placeholder.style.height = img.offsetHeight + 'px';
        placeholder.style.position = 'absolute';
        placeholder.style.top = '0';
        placeholder.style.left = '0';
        placeholder.style.zIndex = '1';

        // Wrap image in container
        const container = document.createElement('div');
        container.style.position = 'relative';
        container.style.display = 'inline-block';

        img.parentNode.insertBefore(container, img);
        container.appendChild(img);
        container.appendChild(placeholder);

        // Remove placeholder when image loads
        img.addEventListener('load', function() {
            placeholder.style.opacity = '0';
            setTimeout(() => {
                if (placeholder.parentNode) {
                    placeholder.parentNode.removeChild(placeholder);
                }
            }, 300);
        });
    });
}

// Additional performance optimizations
function initializeImagePerformanceOptimizations() {
    // Preconnect to image domains
    const preconnectDomains = ['fonts.googleapis.com', 'fonts.gstatic.com'];

    preconnectDomains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = `https://${domain}`;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    });

    // Optimize viewport meta for mobile
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport && !viewport.content.includes('user-scalable=no')) {
        viewport.content += ', user-scalable=no';
    }
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', initializeImagePerformanceOptimizations);

// Progressive image enhancement
function progressiveImageEnhancement() {
    const images = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// Improved mobile touch interactions
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.service-card, .feature-card, .contact-card');

    cards.forEach(card => {
        card.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });

        card.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    });
});

// SEO and accessibility enhancements
function initializeSEOEnhancements() {
    // Add skip link for accessibility
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        z-index: 1000;
        border-radius: 4px;
    `;
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main content ID if not present
    const mainContent = document.querySelector('main') || document.querySelector('.hero');
    if (mainContent && !mainContent.id) {
        mainContent.id = 'main-content';
    }
}

// Call SEO enhancements
document.addEventListener('DOMContentLoaded', initializeSEOEnhancements);

// Enhanced social media hover effects
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const socialLinks = document.querySelectorAll('.social-links a');
        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1) rotate(5deg)';
                this.style.transition = 'transform 0.3s ease';
            });

            link.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1) rotate(0deg)';
            });
        });
    }, 100);
});

// FAQ Dropdown functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all FAQ items with smooth animation
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });

                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });

            // Add keyboard accessibility
            question.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
                }
            });

            // Make focusable for keyboard navigation
            question.setAttribute('tabindex', '0');
            question.setAttribute('role', 'button');
            question.setAttribute('aria-expanded', 'false');

            // Update aria-expanded when item is toggled
            const observer = new MutationObserver(() => {
                const isExpanded = item.classList.contains('active');
                question.setAttribute('aria-expanded', isExpanded);
            });

            observer.observe(item, { attributes: true, attributeFilter: ['class'] });
        }
    });
}

// Initialize FAQ when components are loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait for components to load then initialize FAQ
    setTimeout(initializeFAQ, 1000);

    // Also initialize FAQ when new content is dynamically loaded
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1 && (node.classList?.contains('faq') || node.querySelector?.('.faq'))) {
                        setTimeout(initializeFAQ, 200);
                    }
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});

// Additional FAQ initialization - ensure it works
function ensureFAQWorks() {
    const faqContainer = document.getElementById('faq-container');
    if (faqContainer && faqContainer.innerHTML.trim()) {
        initializeFAQ();
    } else {
        setTimeout(ensureFAQWorks, 200);
    }
}

// Mobile menu initialization function
function initializeMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');

    if (!hamburger || !navMenu || !mobileOverlay) {
        // Elements not ready yet, try again
        setTimeout(initializeMobileMenu, 200);
        return;
    }

    // Remove any existing event listeners to prevent duplicates
    const newHamburger = hamburger.cloneNode(true);
    hamburger.parentNode.replaceChild(newHamburger, hamburger);

    // Add click event to new hamburger
    newHamburger.addEventListener('click', function() {
        const isActive = newHamburger.classList.contains('active');

        newHamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        mobileOverlay.classList.toggle('active');

        // Update ARIA attributes
        newHamburger.setAttribute('aria-expanded', !isActive);

        // Prevent body scroll when menu is open
        document.body.style.overflow = !isActive ? 'hidden' : '';
    });

    // Close menu when clicking overlay
    mobileOverlay.addEventListener('click', function() {
        newHamburger.classList.remove('active');
        navMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        newHamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    });

    console.log('Mobile menu initialized successfully');
}

// Ensure mobile menu initialization
function ensureMobileMenuWorks() {
    const headerContainer = document.getElementById('header-container');
    if (headerContainer && headerContainer.innerHTML.trim()) {
        setTimeout(initializeMobileMenu, 100);
    } else {
        setTimeout(ensureMobileMenuWorks, 200);
    }
}


// Page speed optimization
window.addEventListener('load', function() {
    // Preload critical resources
    const preloadLinks = [
        'roofmasters.html',
        'dirtmasters.html',
        'paintmasters.html',
        'pavingmasters.html',
        'contact.html'
    ];

    preloadLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = href;
        document.head.appendChild(link);
    });
});