// Enhanced Component Loading System
function loadComponent(componentPath, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`Container ${containerId} not found for component ${componentPath}`);
        return Promise.resolve();
    }

    // Hide container immediately to prevent blinking
    container.style.opacity = '0';
    container.style.visibility = 'hidden';
    container.style.transition = 'none';

    return fetch(componentPath + '?v=' + Date.now())
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: Failed to load ${componentPath}`);
            }
            return response.text();
        })
        .then(data => {
            if (data && data.trim()) {
                // Create a temporary container to avoid layout shifts
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = data;

                // Execute scripts with proper error handling
                const scripts = tempDiv.querySelectorAll('script');
                scripts.forEach(script => {
                    try {
                        const newScript = document.createElement('script');
                        if (script.src) {
                            newScript.src = script.src;
                            newScript.async = false;
                        } else {
                            newScript.textContent = script.textContent;
                        }
                        document.head.appendChild(newScript);
                        script.remove();
                    } catch (error) {
                        console.warn(`Script execution warning in ${componentPath}:`, error);
                    }
                });

                // Insert content all at once to minimize reflows
                container.innerHTML = tempDiv.innerHTML;

                // Trigger component-specific initializations
                initializeComponentFeatures(container);

                // Show container smoothly after everything is loaded
                requestAnimationFrame(() => {
                    container.style.transition = 'opacity 0.2s ease, visibility 0.2s ease';
                    container.style.opacity = '1';
                    container.style.visibility = 'visible';
                });

                console.log(`✅ ${componentPath} loaded`);
                return true;
            }
            return false;
        })
        .catch(error => {
            console.error(`❌ Error loading ${componentPath}:`, error);
            container.innerHTML = `<div class="loading-fallback">
                <p>Content loading...</p>
            </div>`;
            container.style.opacity = '1';
            container.style.visibility = 'visible';
            return false;
        });
}

// Initialize component-specific features
function initializeComponentFeatures(container) {
    // Initialize FAQ functionality
    const faqItems = container.querySelectorAll('.faq-item');
    faqItems.forEach(initializeFAQItem);

    // Initialize hover effects
    const cards = container.querySelectorAll('.service-card, .feature-card, .testimonial-card');
    cards.forEach(initializeCardEffects);

    // Initialize scroll animations
    const animElements = container.querySelectorAll('[class*="animate"], .scroll-animate');
    animElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        setTimeout(() => {
            element.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100);
    });
}

// Optimized Loading Screen Controller
class OptimizedLoadingScreen {
    constructor() {
        // Check if already initialized
        if (window.loadingScreenInstance) {
            console.log('⚠️ Loading screen already initialized');
            return window.loadingScreenInstance;
        }

        // Detect page type
        const path = window.location.pathname;
        this.isHomePage = path === '/' || path === '/index.html' || path === '' || path.endsWith('/');

        // Only show loading screen for home page
        if (!this.isHomePage) {
            console.log('📄 Non-home page - no loading screen needed');
            this.isComplete = true;
            return;
        }

        console.log('🚀 Initializing optimized loading screen');

        this.loadingScreen = document.getElementById('loading-screen');
        this.progress = 0;
        this.isComplete = false;
        this.startTime = Date.now();
        this.isMobile = window.innerWidth <= 768;
        this.componentCount = 0;
        this.maxComponents = 13;

        // Store instance
        window.loadingScreenInstance = this;

        this.init();
    }

    init() {
        if (!this.loadingScreen) {
            console.warn('⚠️ Loading screen element not found');
            this.isComplete = true;
            return;
        }

        // Force loading screen visibility
        this.loadingScreen.style.display = 'flex';
        this.loadingScreen.style.opacity = '1';
        this.loadingScreen.style.visibility = 'visible';
        this.loadingScreen.style.zIndex = '10000';

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        // Get progress elements
        this.progressFill = this.loadingScreen.querySelector('.progress-fill');
        this.loadingPercentage = this.loadingScreen.querySelector('.loading-percentage');

        // Start progress tracking
        this.startProgressTracking();

        console.log('✅ Loading screen active');
    }

    startProgressTracking() {
        const startTime = Date.now();

        const updateProgress = () => {
            const elapsed = Date.now() - startTime;

            // Count loaded components
            const containers = document.querySelectorAll('[id$="-container"]');
            let loadedCount = 0;

            containers.forEach(container => {
                if (container.innerHTML.trim() !== '') {
                    loadedCount++;
                }
            });

            this.componentCount = loadedCount;

            // Calculate progress
            const componentProgress = Math.min((this.componentCount / this.maxComponents) * 80, 80);
            const timeProgress = Math.min((elapsed / 1500) * 20, 20);
            this.progress = Math.min(componentProgress + timeProgress, 100);

            this.updateProgressBar();

            // Check completion conditions
            const hasHeader = document.querySelector('#main-header header, .header');
            const hasHero = document.querySelector('#hero-container');
            const headerLoaded = hasHeader && hasHeader.innerHTML.trim() !== '';
            const heroLoaded = hasHero && hasHero.innerHTML.trim() !== '';

            const minTime = this.isMobile ? 1000 : 800;
            const canComplete = (
                (headerLoaded && heroLoaded && elapsed >= minTime) ||
                (this.componentCount >= 8 && elapsed >= minTime) ||
                elapsed >= 2500
            );

            if (canComplete && !this.isComplete) {
                this.complete();
            } else if (!this.isComplete) {
                requestAnimationFrame(updateProgress);
            }
        };

        requestAnimationFrame(updateProgress);
    }

    updateProgressBar() {
        if (this.progressFill && this.loadingPercentage) {
            this.progressFill.style.width = this.progress + '%';
            this.loadingPercentage.textContent = Math.round(this.progress) + '%';
        }
    }

    complete() {
        if (this.isComplete) return;

        this.isComplete = true;
        this.progress = 100;
        this.updateProgressBar();

        console.log(`✅ Loading complete: ${this.componentCount}/${this.maxComponents} components`);

        // Wait a moment then hide
        setTimeout(() => this.hide(), this.isMobile ? 600 : 400);
    }

    hide() {
        if (!this.loadingScreen) return;

        console.log('🎉 Hiding loading screen');

        // Ensure header is visible immediately
        const headerContainer = document.getElementById('header-container');
        if (headerContainer) {
            headerContainer.style.opacity = '1';
            headerContainer.style.visibility = 'visible';
        }

        // Show body content immediately
        document.body.style.opacity = '1';
        document.body.style.visibility = 'visible';

        // Start hide animation
        this.loadingScreen.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        this.loadingScreen.style.opacity = '0';
        this.loadingScreen.style.visibility = 'hidden';
        this.loadingScreen.style.transform = 'scale(0.95)';
        this.loadingScreen.style.pointerEvents = 'none';

        // Restore body scroll
        document.body.style.overflow = '';

        // Initialize animations immediately
        setTimeout(() => {
            if (window.animationController) {
                window.animationController.init();
            }

            // Remove loading screen
            setTimeout(() => {
                if (this.loadingScreen && this.loadingScreen.parentNode) {
                    this.loadingScreen.remove();
                    console.log('✅ Loading screen removed');
                }
            }, 600);
        }, 100);
    }
}

// Enhanced Animation Controller
class ModernAnimationController {
    constructor() {
        this.observers = [];
        this.animatedElements = new Set();
        this.isInitialized = false;
    }

    init() {
        if (this.isInitialized) return;

        console.log('🎬 Initializing animations');

        this.waitForComponents().then(() => {
            this.initializeScrollAnimations();
            this.initializeHoverEffects();
            this.isInitialized = true;
            console.log('✅ Animations initialized');
        });
    }

    waitForComponents() {
        return new Promise((resolve) => {
            let attempts = 0;
            const maxAttempts = 30;

            const checkComponents = () => {
                attempts++;
                const totalContainers = document.querySelectorAll('[id$="-container"]').length;
                const loadedContainers = document.querySelectorAll('[id$="-container"]:not(:empty)').length;

                if (loadedContainers >= Math.max(6, totalContainers * 0.5) || attempts >= maxAttempts) {
                    console.log(`📊 Components ready: ${loadedContainers}/${totalContainers}`);
                    resolve();
                } else {
                    setTimeout(checkComponents, 100);
                }
            };
            checkComponents();
        });
    }

    initializeScrollAnimations() {
        const observerOptions = {
            threshold: [0, 0.1, 0.3],
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animatedElements.add(entry.target);
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements
        const elementsToAnimate = document.querySelectorAll(`
            .service-card, .feature-card, .contact-card, .testimonial-card,
            .gallery-item, .process-step, .stats-item, .faq-item,
            .area-badge, .benefit-item, section, .content-section
        `);

        elementsToAnimate.forEach((el) => {
            if (!this.animatedElements.has(el)) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                observer.observe(el);
            }
        });

        this.observers.push(observer);
    }

    animateElement(element) {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            element.classList.add('animated');
        }, Math.random() * 200);
    }

    initializeHoverEffects() {
        const interactiveElements = document.querySelectorAll(`
            .btn, .service-card, .feature-card, .contact-card,
            .testimonial-card, .gallery-item, .area-badge
        `);

        interactiveElements.forEach(el => {
            el.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

            el.addEventListener('mouseenter', () => {
                if (el.matches('.btn')) {
                    el.style.transform = 'translateY(-3px) scale(1.02)';
                } else if (el.matches('.service-card, .feature-card')) {
                    el.style.transform = 'translateY(-8px) scale(1.02)';
                    el.style.boxShadow = '0 20px 40px rgba(154, 205, 50, 0.2)';
                } else {
                    el.style.transform = 'translateY(-5px) scale(1.01)';
                }
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translateY(0) scale(1)';
                el.style.boxShadow = '';
            });
        });
    }

    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
        this.animatedElements.clear();
        this.isInitialized = false;
    }
}

// Enhanced FAQ System
function initializeFAQItem(item) {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (question && answer) {
        answer.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        answer.style.overflow = 'hidden';

        if (!item.classList.contains('active')) {
            answer.style.maxHeight = '0px';
            answer.style.opacity = '0';
        } else {
            answer.style.maxHeight = answer.scrollHeight + 'px';
            answer.style.opacity = '1';
        }

        question.addEventListener('click', (e) => {
            e.preventDefault();
            const isActive = item.classList.contains('active');

            // Close other FAQs
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    otherAnswer.style.maxHeight = '0px';
                    otherAnswer.style.opacity = '0';
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.opacity = '1';
            } else {
                item.classList.remove('active');
                answer.style.maxHeight = '0px';
                answer.style.opacity = '0';
            }
        });
    }
}

// Enhanced Card Effects
function initializeCardEffects(card) {
    card.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
        card.style.boxShadow = '0 15px 30px rgba(154, 205, 50, 0.15)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = '';
    });
}

// Optimized Header Controller
class OptimizedHeaderController {
    constructor() {
        if (window.headerInstance) {
            console.log('⚠️ Header already initialized');
            return window.headerInstance;
        }

        window.headerInstance = this;
        this.isInitialized = false;
        this.init();
    }

    init() {
        // Wait for header element
        const checkHeader = () => {
            this.header = document.querySelector('#main-header, header, .header');

            if (this.header && !this.isInitialized) {
                this.isInitialized = true;
                this.setupEventListeners();
                this.initScrollEffects();
                console.log('✅ Header initialized');
            } else if (!this.header) {
                setTimeout(checkHeader, 100);
            }
        };

        checkHeader();
    }

    setupEventListeners() {
        // Mobile menu elements
        this.mobileMenuBtn = this.header.querySelector('#mobile-menu-btn, .mobile-menu-btn');
        this.mobileMenu = this.header.querySelector('#mobile-menu, .mobile-menu');
        this.mobileOverlay = this.header.querySelector('#mobile-overlay, .mobile-overlay');

        // Mobile menu toggle
        if (this.mobileMenuBtn && this.mobileMenu) {
            this.mobileMenuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMobileMenu();
            });
        }

        // Mobile services toggle
        const servicesToggle = this.header.querySelector('.mobile-services-toggle');
        const servicesDiv = this.header.querySelector('.mobile-services');

        if (servicesToggle && servicesDiv) {
            servicesToggle.addEventListener('click', (e) => {
                e.preventDefault();
                servicesDiv.classList.toggle('active');
            });
        }

        // Close menu on overlay click
        if (this.mobileOverlay) {
            this.mobileOverlay.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }

        // Close menu on nav link clicks
        const navLinks = this.header.querySelectorAll('.mobile-nav-link, .mobile-service-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        const isOpen = this.mobileMenu.classList.contains('active');

        if (isOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        this.mobileMenuBtn.classList.add('active');
        this.mobileMenu.classList.add('active');
        if (this.mobileOverlay) this.mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeMobileMenu() {
        this.mobileMenuBtn.classList.remove('active');
        this.mobileMenu.classList.remove('active');
        if (this.mobileOverlay) this.mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';

        // Close services menu too
        const servicesDiv = this.header.querySelector('.mobile-services');
        if (servicesDiv) {
            servicesDiv.classList.remove('active');
        }
    }

    initScrollEffects() {
        let ticking = false;
        let lastScrollY = 0;

        const updateHeader = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > 50) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }

            lastScrollY = currentScrollY;
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
    }
}

// Initialize Enhanced Features
function initializeEnhancedFeatures() {
    // Initialize smooth scrolling
    document.addEventListener('click', function(e) {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const href = e.target.getAttribute('href');

            if (href && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                    const targetPosition = target.offsetTop - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        }
    });

    // Initialize forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.style.transition = 'all 0.3s ease';

            input.addEventListener('focus', () => {
                input.style.transform = 'scale(1.02)';
                input.style.boxShadow = '0 0 0 3px rgba(154, 205, 50, 0.15)';
            });

            input.addEventListener('blur', () => {
                input.style.transform = 'scale(1)';
                input.style.boxShadow = 'none';
            });
        });
    });

    // Optimize images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.loading = 'lazy';
        img.decoding = 'async';

        if (!img.style.transition) {
            img.style.transition = 'opacity 0.3s ease';
        }
    });

    console.log('✅ Enhanced features initialized');
}

// Main initialization - SINGLE POINT OF ENTRY
let isSystemInitialized = false;

document.addEventListener('DOMContentLoaded', function() {
    if (isSystemInitialized) {
        console.log('⚠️ System already initialized, skipping...');
        return;
    }

    isSystemInitialized = true;
    console.log('🚀 Initializing website system');

    // Hide page content initially to prevent blinking
    document.body.style.opacity = '0';
    document.body.style.visibility = 'hidden';
    document.body.style.transition = 'none';

    // Disable animations during loading
    document.documentElement.style.setProperty('--disable-animations', '1');

    // Initialize loading screen (only for home page)
    window.loadingScreenController = new OptimizedLoadingScreen();

    // Initialize animation controller
    window.animationController = new ModernAnimationController();

    // Detect page type and load components
    const path = window.location.pathname;
    const isHomePage = path === '/' || path === '/index.html' || path === '' || path.endsWith('/');

    if (isHomePage) {
        // Home page component loading
        const components = [
            { id: 'header-container', file: 'header.html', priority: 1 },
            { id: 'hero-container', file: 'components/hero-section.html', priority: 1 },
            { id: 'benefits-container', file: 'components/benefits-banner.html', priority: 2 },
            { id: 'services-container', file: 'components/services-overview.html', priority: 2 },
            { id: 'contact-cta-container', file: 'components/contact-cta.html', priority: 2 },
            { id: 'why-choose-container', file: 'components/why-choose.html', priority: 3 },
            { id: 'service-areas-container', file: 'components/service-areas.html', priority: 3 },
            { id: 'gallery-container', file: 'components/gallery.html', priority: 3 },
            { id: 'testimonials-container', file: 'components/testimonials.html', priority: 4 },
            { id: 'process-container', file: 'components/process.html', priority: 4 },
            { id: 'stats-container', file: 'components/stats.html', priority: 4 },
            { id: 'faq-container', file: 'components/faq.html', priority: 5 },
            { id: 'footer-container', file: 'footer.html', priority: 5 }
        ];

        // Load critical components first
        const criticalComponents = components.filter(c => c.priority === 1);
        Promise.all(criticalComponents.map(c => loadComponent(c.file, c.id)))
            .then(() => {
                // Ensure header container is visible
                const headerContainer = document.getElementById('header-container');
                if (headerContainer) {
                    headerContainer.style.opacity = '1';
                    headerContainer.style.visibility = 'visible';
                }

                // Initialize header immediately
                setTimeout(() => {
                    window.headerController = new OptimizedHeaderController();
                }, 100);

                // Load remaining components asynchronously
                const remainingComponents = components.filter(c => c.priority > 1);
                remainingComponents.forEach(c => {
                    loadComponent(c.file, c.id);
                });

                // Re-enable animations
                setTimeout(() => {
                    document.documentElement.style.removeProperty('--disable-animations');
                    initializeEnhancedFeatures();
                }, 300);
            });
    } else {
        // Non-home page: fast loading
        document.body.style.opacity = '1';
        document.body.style.visibility = 'visible';

        // Load header and footer only
        const hasHeader = document.getElementById('header-container');
        const hasFooter = document.getElementById('footer-container');

        if (hasHeader) {
            loadComponent('header.html', 'header-container').then(() => {
                window.headerController = new OptimizedHeaderController();
            });
        }
        if (hasFooter) {
            loadComponent('footer.html', 'footer-container');
        }

        setTimeout(() => {
            document.documentElement.style.removeProperty('--disable-animations');
            initializeEnhancedFeatures();
            if (window.animationController) {
                window.animationController.init();
            }
        }, 200);
    }
});

// Global error handling
window.addEventListener('error', (e) => {
    console.warn('⚠️ Non-critical error:', e.message);
});

window.addEventListener('unhandledrejection', (e) => {
    console.warn('⚠️ Unhandled promise rejection:', e.reason);
    e.preventDefault();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.animationController) {
        window.animationController.destroy();
    }
});