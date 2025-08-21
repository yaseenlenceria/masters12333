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

// Global error handler for better debugging
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error?.message || e.message, e.error?.stack || '');
});

// Load all components on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, starting component loading...');
    
    try {

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
        initializePageTransitions();

        // Set body padding for fixed header
        const header = document.querySelector('.header');
        if (header) {
            document.body.style.paddingTop = header.offsetHeight + 'px';
        }

        console.log('Component initialization complete');
    }, 300);

    // Initialize mobile menu and FAQ with longer delay to ensure components are loaded
    setTimeout(() => {
        ensureMobileMenuWorks();
        ensureFAQWorks();
    }, 800);
    
    } catch (error) {
        console.error('Error during component initialization:', error);
    }
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

// Enhanced smooth scrolling with easing
function initializeSmoothScrolling() {
    // Enhanced smooth scroll for anchor links
    document.addEventListener('click', function(e) {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const target = document.querySelector(e.target.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                const targetPosition = target.offsetTop - headerHeight - 20;

                // Smooth scroll with custom easing
                smoothScrollTo(targetPosition, 800);
            }
        }
    });

    // Add parallax effect for hero section
    let ticking = false;
    function updateParallax() {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const parallaxElements = document.querySelectorAll('.hero, .page-header');

                parallaxElements.forEach(el => {
                    if (el) {
                        const speed = 0.5;
                        el.style.transform = `translateY(${scrolled * speed}px)`;
                    }
                });

                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', updateParallax, { passive: true });
}

// Custom smooth scroll function with easing
function smoothScrollTo(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const easeProgress = easeInOutCubic(progress);

        window.scrollTo(0, startPosition + distance * easeProgress);

        if (progress < 1) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
}

// Add page transition effects
function initializePageTransitions() {
    // Fade in page content on load
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)';

    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    });

    // Add loading state for navigation
    document.querySelectorAll('a[href]:not([href^="#"]):not([href^="tel:"]):not([href^="mailto:"])').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.hostname === window.location.hostname) {
                document.body.style.opacity = '0.7';
                document.body.style.transition = 'opacity 0.3s ease';
            }
        });
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

// Enhanced Animation initialization with comprehensive smooth effects
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Staggered animation with enhanced delays
                setTimeout(() => {
                    entry.target.classList.add('animate');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';

                    // Add special effects for different element types
                    if (entry.target.classList.contains('service-card')) {
                        entry.target.style.animation = 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards';
                    } else if (entry.target.classList.contains('feature-card')) {
                        entry.target.style.animation = 'fadeInLeft 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards';
                    } else if (entry.target.classList.contains('contact-card')) {
                        entry.target.style.animation = 'scaleIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
                    } else if (entry.target.classList.contains('stats-item')) {
                        entry.target.style.animation = 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards';
                        // Trigger counter animation
                        animateCounter(entry.target);
                    }
                }, index * 150);
            }
        });
    }, observerOptions);

    // Observe elements for animation with enhanced transitions
    const animatedElements = document.querySelectorAll('.service-card, .feature-card, .contact-card, .testimonial-card, .gallery-item, .project-item, .stats-item, .benefit-item, .area-item');

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px) scale(0.95)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        el.classList.add('scroll-animate');
        observer.observe(el);
    });

    // Enhanced text animations with staggered reveals
    const textElements = document.querySelectorAll('h1, h2, h3, .hero-title, .section-title');
    textElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';

        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            el.classList.add('text-reveal');
        }, 300 + (index * 200));
    });

    // Initialize smooth interactions
    addSmoothInteractions();
    initializeParallaxEffects();
}

// Counter animation for stats
function animateCounter(element) {
    const numberElement = element.querySelector('.stats-number, .number');
    if (!numberElement) return;

    const finalNumber = parseInt(numberElement.textContent.replace(/\D/g, ''));
    const duration = 2000;
    const startTime = Date.now();

    function updateCounter() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentNumber = Math.floor(finalNumber * easeOutCubic(progress));

        numberElement.textContent = currentNumber.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    requestAnimationFrame(updateCounter);
}

// Parallax effects for enhanced visual appeal
function initializeParallaxEffects() {
    let ticking = false;

    function updateParallax() {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;

                // Parallax for hero sections
                const heroElements = document.querySelectorAll('.hero, .page-header');
                heroElements.forEach(el => {
                    if (el) {
                        const speed = 0.3;
                        el.style.transform = `translateY(${scrolled * speed}px)`;
                    }
                });

                // Parallax for floating elements
                const floatingElements = document.querySelectorAll('.floating-animation, .sub-logo');
                floatingElements.forEach((el, index) => {
                    if (el) {
                        const speed = 0.1 + (index * 0.05);
                        const yPos = -(scrolled * speed);
                        el.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.02}deg)`;
                    }
                });

                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', updateParallax, { passive: true });
}

// Create scroll progress indicator
function createScrollProgressIndicator() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-indicator';
    document.body.appendChild(progressBar);

    let ticking = false;
    function updateScrollProgress() {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrollPercent = (scrollTop / scrollHeight) * 100;

                progressBar.style.width = Math.min(scrollPercent, 100) + '%';
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress(); // Initial call
}

// Enhanced hover interactions
function addSmoothInteractions() {
    const interactiveElements = document.querySelectorAll('.service-card, .feature-card, .contact-card, .btn, .nav-link, .testimonial-card');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', function(e) {
            this.style.transform = this.classList.contains('btn') ?
                'translateY(-3px) scale(1.02)' :
                'translateY(-5px) scale(1.02)';
        });

        el.addEventListener('mouseleave', function(e) {
            this.style.transform = 'translateY(0) scale(1)';
        });

        // Add ripple effect on click
        el.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Legacy function name for compatibility
function addHoverInteractions() {
    addSmoothInteractions();
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
    // Wait for FAQ component to be fully loaded
    const checkFAQ = () => {
        const faqContainer = document.getElementById('faq-container');
        const faqItems = document.querySelectorAll('.faq-item');

        if (!faqContainer || faqItems.length === 0) {
            console.log('FAQ not ready, retrying...');
            return false;
        }

        faqItems.forEach((item, index) => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            if (question && answer) {
                // Remove existing event listeners to prevent duplicates
                const newQuestion = question.cloneNode(true);
                question.parentNode.replaceChild(newQuestion, question);

                // Add smooth transition styles
                answer.style.transition = 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease';
                answer.style.overflow = 'hidden';

                // Set initial state
                if (!item.classList.contains('active')) {
                    answer.style.maxHeight = '0px';
                    answer.style.opacity = '0';
                } else {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    answer.style.opacity = '1';
                }

                newQuestion.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    const isActive = item.classList.contains('active');

                    // Close all FAQ items with smooth animation
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            const otherAnswer = otherItem.querySelector('.faq-answer');
                            if (otherAnswer) {
                                otherAnswer.style.maxHeight = '0px';
                                otherAnswer.style.opacity = '0';
                            }
                            otherItem.classList.remove('active');
                        }
                    });

                    // Toggle current item
                    if (!isActive) {
                        item.classList.add('active');
                        answer.style.maxHeight = answer.scrollHeight + 'px';
                        answer.style.opacity = '1';
                    } else {
                        item.classList.remove('active');
                        answer.style.maxHeight = '0px';
                        answer.style.opacity = '0';
                    }

                    console.log('FAQ item toggled:', index, !isActive);
                });

                // Add touch support
                newQuestion.addEventListener('touchstart', function(e) {
                    this.style.backgroundColor = 'rgba(154, 205, 50, 0.1)';
                });

                newQuestion.addEventListener('touchend', function(e) {
                    this.style.backgroundColor = '';
                });

                // Add keyboard accessibility
                newQuestion.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        newQuestion.click();
                    }
                });

                // Make focusable for keyboard navigation
                newQuestion.setAttribute('tabindex', '0');
                newQuestion.setAttribute('role', 'button');
                newQuestion.setAttribute('aria-expanded', item.classList.contains('active'));
                newQuestion.style.cursor = 'pointer';
                newQuestion.style.touchAction = 'manipulation';

                // Update aria-expanded when item is toggled
                const observer = new MutationObserver(() => {
                    const isExpanded = item.classList.contains('active');
                    newQuestion.setAttribute('aria-expanded', isExpanded);
                });

                observer.observe(item, { attributes: true, attributeFilter: ['class'] });
            }
        });

        console.log('FAQ initialized with', faqItems.length, 'items');
        return true;
    };

    // Retry mechanism
    let retries = 0;
    const maxRetries = 10;
    
    const tryInitFAQ = () => {
        if (checkFAQ() || retries >= maxRetries) {
            return;
        }
        retries++;
        setTimeout(tryInitFAQ, 300);
    };

    tryInitFAQ();
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
    const dropdowns = document.querySelectorAll('.dropdown');

    if (!hamburger || !navMenu || !mobileOverlay) {
        // Elements not ready yet, try again
        setTimeout(initializeMobileMenu, 200);
        return;
    }

    // Add hamburger click event
    hamburger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isActive = hamburger.classList.contains('active');
        
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        
        // Update ARIA attributes
        hamburger.setAttribute('aria-expanded', !isActive);
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = !isActive ? 'hidden' : '';
        
        console.log('Mobile menu toggled:', !isActive);
    });

    // Close menu when clicking overlay
    mobileOverlay.addEventListener('click', closeMenu);

    // Close menu with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // Handle mobile dropdowns
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        
        if (toggle) {
            toggle.addEventListener('click', function(e) {
                if (window.innerWidth <= 968) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Close other dropdowns
                    dropdowns.forEach(otherDropdown => {
                        if (otherDropdown !== dropdown) {
                            otherDropdown.classList.remove('active');
                        }
                    });
                    
                    dropdown.classList.toggle('active');
                    
                    const isExpanded = dropdown.classList.contains('active');
                    toggle.setAttribute('aria-expanded', isExpanded);
                    
                    console.log('Dropdown toggled:', dropdown, isExpanded);
                }
            });
        }
    });

    // Handle dropdown links
    document.querySelectorAll('.dropdown-link').forEach(link => {
        link.addEventListener('click', function(e) {
            // Allow normal navigation for dropdown links
            closeMenu();
        });
    });

    // Close menu when clicking regular nav links (not dropdown toggles)
    document.querySelectorAll('.nav-link:not(.dropdown-toggle)').forEach(link => {
        link.addEventListener('click', function(e) {
            // Only close menu if it's not a dropdown toggle
            if (!link.classList.contains('dropdown-toggle')) {
                closeMenu();
            }
        });
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 968) {
            closeMenu();
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });

    function closeMenu() {
        if (hamburger && navMenu && mobileOverlay) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            mobileOverlay.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    }

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