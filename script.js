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

// Enhanced Animation System
class AnimationController {
    constructor() {
        this.observers = [];
        this.initialized = false;
        this.init();
    }

    init() {
        if (this.initialized) return;

        this.initializeScrollAnimations();
        this.initializeHoverAnimations();
        this.initializeCounterAnimations();
        this.initializeParallaxEffects();
        this.initializeStaggeredAnimations();

        this.initialized = true;
        console.log('Animation controller initialized');
    }

    initializeScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animate');
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0) scale(1)';

                        // Special animations for different element types
                        if (entry.target.classList.contains('service-card')) {
                            entry.target.style.animation = 'fadeInUp 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
                        } else if (entry.target.classList.contains('feature-card')) {
                            entry.target.style.animation = 'fadeInLeft 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
                        } else if (entry.target.classList.contains('contact-card')) {
                            entry.target.style.animation = 'scaleIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
                        } else if (entry.target.classList.contains('stats-item')) {
                            entry.target.style.animation = 'bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
                            this.animateCounter(entry.target);
                        } else if (entry.target.classList.contains('testimonial-card')) {
                            entry.target.style.animation = 'slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards';
                        }
                    }, index * 100);
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animatedElements = document.querySelectorAll(
            '.service-card, .feature-card, .contact-card, .testimonial-card, ' +
            '.gallery-item, .project-item, .stats-item, .benefit-item, .area-item, ' +
            '.process-step, .faq-item'
        );

        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(40px) scale(0.95)';
            el.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            el.classList.add('scroll-animate');
            observer.observe(el);
        });

        this.observers.push(observer);
    }

    initializeHoverAnimations() {
        const interactiveElements = document.querySelectorAll(
            '.service-card, .feature-card, .contact-card, .btn, ' +
            '.nav-link, .testimonial-card, .gallery-item, .project-item'
        );

        interactiveElements.forEach(el => {
            // Enhanced hover effects
            el.addEventListener('mouseenter', (e) => {
                if (el.classList.contains('btn')) {
                    el.style.transform = 'translateY(-5px) scale(1.05)';
                } else if (el.classList.contains('service-card')) {
                    el.style.transform = 'translateY(-10px) rotateX(5deg) rotateY(2deg)';
                    el.style.boxShadow = '0 25px 50px rgba(154, 205, 50, 0.2)';
                } else if (el.classList.contains('feature-card')) {
                    el.style.transform = 'translateY(-8px) rotateY(3deg)';
                } else if (el.classList.contains('contact-card')) {
                    el.style.transform = 'translateY(-10px) scale(1.03)';
                } else {
                    el.style.transform = 'translateY(-5px) scale(1.02)';
                }

                el.style.transition = 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            });

            el.addEventListener('mouseleave', (e) => {
                el.style.transform = 'translateY(0) scale(1) rotateX(0) rotateY(0)';
                el.style.boxShadow = '';
            });

            // Ripple effect on click
            el.addEventListener('click', (e) => {
                this.createRipple(e, el);
            });

            // Touch feedback for mobile
            el.addEventListener('touchstart', (e) => {
                el.style.transform = 'scale(0.98)';
            });

            el.addEventListener('touchend', (e) => {
                setTimeout(() => {
                    el.style.transform = 'scale(1)';
                }, 100);
            });
        });
    }

    createRipple(event, element) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');

        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        element.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    animateCounter(element) {
        const numberElement = element.querySelector('.stats-number, .number, [data-count]');
        if (!numberElement) return;

        const finalNumber = parseInt(numberElement.textContent.replace(/\D/g, ''));
        const duration = 2000;
        const startTime = Date.now();
        const suffix = numberElement.textContent.replace(/[0-9]/g, '');

        const updateCounter = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentNumber = Math.floor(finalNumber * this.easeOutCubic(progress));

            numberElement.textContent = currentNumber.toLocaleString() + suffix;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };

        requestAnimationFrame(updateCounter);
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    initializeCounterAnimations() {
        const counters = document.querySelectorAll('[data-count]');

        counters.forEach(counter => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(entry.target.parentElement);
                        observer.unobserve(entry.target);
                    }
                });
            });

            observer.observe(counter);
            this.observers.push(observer);
        });
    }

    initializeParallaxEffects() {
        let ticking = false;

        const updateParallax = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;

                    // Parallax for background elements (not hero)
                    const parallaxElements = document.querySelectorAll('.bg-circle, .floating-animation:not(.hero *)');
                    parallaxElements.forEach((el, index) => {
                        if (el && el.offsetParent) {
                            const speed = 0.02 + (index * 0.01);
                            const yPos = -(scrolled * speed);
                            el.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.01}deg)`;
                        }
                    });

                    // Page header parallax
                    const pageHeaders = document.querySelectorAll('.page-header');
                    pageHeaders.forEach(el => {
                        if (el && el.offsetHeight > 0) {
                            const rect = el.getBoundingClientRect();
                            const elementTop = rect.top + scrolled;
                            const elementHeight = el.offsetHeight;

                            if (scrolled < elementTop + elementHeight) {
                                const speed = 0.1;
                                const transform = scrolled * speed;
                                el.style.transform = `translateY(${transform}px)`;
                            }
                        }
                    });

                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', updateParallax, { passive: true });
    }

    initializeStaggeredAnimations() {
        const textElements = document.querySelectorAll('h1, h2, h3, .hero-title, .section-title');

        textElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';

            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
                el.classList.add('text-reveal');
            }, 300 + (index * 150));
        });
    }

    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
        this.initialized = false;
    }
}

// Global Animation Controller Instance
let animationController;

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

        // Load components that exist on the current page
        Object.entries(componentMappings).forEach(([containerId, componentPath]) => {
            const container = document.getElementById(containerId);
            if (container) {
                console.log(`Loading component ${componentPath} into ${containerId}`);
                loadComponent(componentPath, containerId);
            }
        });

        // Initialize components after loading
        setTimeout(() => {
            initializeAllComponents();
        }, 500);

    } catch (error) {
        console.error('Error during component initialization:', error);
    }
});

// Initialize all components and animations
function initializeAllComponents() {
    // Initialize animation controller
    animationController = new AnimationController();

    // Initialize other components
    initializeFormHandling();
    initializeSmoothScrolling();
    initializePageTransitions();

    // Initialize FAQ and mobile menu with delay to ensure components are loaded
    setTimeout(() => {
        ensureFAQWorks();
        ensureMobileMenuWorks();
    }, 300);

    console.log('All components initialized');
}

// Enhanced smooth scrolling
function initializeSmoothScrolling() {
    document.addEventListener('click', function(e) {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const href = e.target.getAttribute('href');
            if (href && href !== '#' && href.length > 1) {
                try {
                    const target = document.querySelector(href);
                    if (target) {
                        const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                        const targetPosition = target.offsetTop - headerHeight - 20;

                        smoothScrollTo(targetPosition, 800);
                    }
                } catch (error) {
                    console.warn('Invalid selector:', href);
                }
            }
        }
    });
}

// Custom smooth scroll function
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

// Enhanced page transitions
function initializePageTransitions() {
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

    if (document.readyState === 'loading') {
        document.body.style.opacity = '0';

        window.addEventListener('load', () => {
            document.body.style.opacity = '1';
        });
    }

    // Enhanced navigation feedback
    document.querySelectorAll('a[href]:not([href^="#"]):not([href^="tel:"]):not([href^="mailto:"])').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.hostname === window.location.hostname) {
                link.style.transform = 'scale(0.95)';
                link.style.transition = 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
                setTimeout(() => {
                    link.style.transform = 'scale(1)';
                }, 150);
            }
        });
    });
}

// Enhanced form handling
function initializeFormHandling() {
    const contactForms = document.querySelectorAll('form');

    contactForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            if (!validateForm(data)) {
                return;
            }

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            // Enhanced loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');

            // Simulate form submission
            setTimeout(() => {
                this.reset();
                submitBtn.textContent = 'Sent Successfully!';
                submitBtn.style.background = '#10b981';

                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('loading');
                    submitBtn.style.background = '';
                }, 2000);
            }, 1500);
        });
    });
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('Please enter a valid email address.');
        return false;
    }

    const phoneRegex = /^(\+353|0)[0-9]{8,9}$/;
    if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
        alert('Please enter a valid Irish phone number.');
        return false;
    }

    return true;
}

// Enhanced FAQ functionality
function initializeFAQ() {
    const faqContainer = document.getElementById('faq-container');
    const faqItems = document.querySelectorAll('.faq-item');

    if (!faqContainer || faqItems.length === 0) {
        return false;
    }

    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (question && answer) {
            // Remove existing event listeners
            const newQuestion = question.cloneNode(true);
            question.parentNode.replaceChild(newQuestion, question);

            // Enhanced transition styles
            answer.style.transition = 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, transform 0.4s ease';
            answer.style.overflow = 'hidden';
            answer.style.transformOrigin = 'top';

            // Set initial state
            if (!item.classList.contains('active')) {
                answer.style.maxHeight = '0px';
                answer.style.opacity = '0';
                answer.style.transform = 'scaleY(0)';
            } else {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.opacity = '1';
                answer.style.transform = 'scaleY(1)';
            }

            newQuestion.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const isActive = item.classList.contains('active');

                // Close all FAQ items with animation
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        if (otherAnswer) {
                            otherAnswer.style.maxHeight = '0px';
                            otherAnswer.style.opacity = '0';
                            otherAnswer.style.transform = 'scaleY(0)';
                        }
                        otherItem.classList.remove('active');
                    }
                });

                // Toggle current item with enhanced animation
                if (!isActive) {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    answer.style.opacity = '1';
                    answer.style.transform = 'scaleY(1)';
                } else {
                    item.classList.remove('active');
                    answer.style.maxHeight = '0px';
                    answer.style.opacity = '0';
                    answer.style.transform = 'scaleY(0)';
                }
            });

            // Enhanced accessibility
            newQuestion.setAttribute('tabindex', '0');
            newQuestion.setAttribute('role', 'button');
            newQuestion.setAttribute('aria-expanded', item.classList.contains('active'));
            newQuestion.style.cursor = 'pointer';
            newQuestion.style.touchAction = 'manipulation';

            // Keyboard support
            newQuestion.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    newQuestion.click();
                }
            });
        }
    });

    console.log('FAQ initialized with', faqItems.length, 'items');
    return true;
}

// Ensure FAQ works with retry mechanism
function ensureFAQWorks() {
    let retries = 0;
    const maxRetries = 10;

    const tryInitFAQ = () => {
        if (initializeFAQ() || retries >= maxRetries) {
            return;
        }
        retries++;
        setTimeout(tryInitFAQ, 200);
    };

    tryInitFAQ();
}

// Mobile menu fallback (main functionality is in header component)
function ensureMobileMenuWorks() {
    console.log('Mobile menu managed by header component');
}

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error?.message || e.message);
});

// Performance optimizations
document.addEventListener('DOMContentLoaded', function() {
    // Optimize images
    optimizeImages();

    // Add performance observers
    if ('PerformanceObserver' in window) {
        const perfObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'largest-contentful-paint') {
                    console.log('LCP:', entry.startTime);
                }
            }
        });

        perfObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    }
});

// Image optimization
function optimizeImages() {
    const images = document.querySelectorAll('img');

    images.forEach(img => {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }

        img.setAttribute('decoding', 'async');

        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });

        img.addEventListener('error', function() {
            console.warn('Failed to load image:', this.src);
            this.style.display = 'none';
        });
    });
}

// Cleanup function
window.addEventListener('beforeunload', function() {
    if (animationController) {
        animationController.destroy();
    }
});

// Page speed optimization
window.addEventListener('load', function() {
    // Preload important pages
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