// Component Loading System
function loadComponent(componentPath, containerId) {
    fetch(componentPath)
        .then(response => response.text())
        .then(data => {
            document.getElementById(containerId).innerHTML = data;

            // Re-initialize navigation after header is loaded
            if (containerId === 'header-container') {
                initializeNavigation();
                setActiveNavLink();
            }
        })
        .catch(error => console.error('Error loading component:', error));
}

// Load header and footer on all pages
document.addEventListener('DOMContentLoaded', function() {
    loadComponent('header.html', 'header-container');
    loadComponent('footer.html', 'footer-container');

    // Initialize other components
    initializeAnimations();
    initializeFormHandling();
    initializeSmoothScrolling();
});

// Navigation initialization
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');

            // Improve accessibility
            const isExpanded = hamburger.classList.contains('active');
            hamburger.setAttribute('aria-expanded', isExpanded);
        });

        // Close mobile menu when clicking on nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }
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

// Advanced Image Optimization and Lazy Loading
document.addEventListener('DOMContentLoaded', function() {
    // Preload critical images
    preloadCriticalImages();

    // Initialize optimized lazy loading
    initializeOptimizedLazyLoading();

    // Optimize all images
    optimizeAllImages();

    // Add loading states
    addImageLoadingStates();
});

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
    }, 1000);
});

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