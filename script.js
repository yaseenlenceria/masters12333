// Component Loading System
function loadComponent(componentPath, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`Container ${containerId} not found for component ${componentPath}`);
        return Promise.resolve();
    }

    return fetch(componentPath + '?v=' + performance.now())
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: Failed to load ${componentPath}`);
            }
            return response.text();
        })
        .then(data => {
            if (data && data.trim()) {
                container.innerHTML = data;

                // Execute scripts with error handling
                const scripts = container.querySelectorAll('script');
                scripts.forEach(script => {
                    try {
                        const newScript = document.createElement('script');
                        if (script.src) {
                            newScript.src = script.src;
                        } else {
                            newScript.textContent = script.textContent;
                        }
                        document.head.appendChild(newScript);
                        script.remove();
                    } catch (error) {
                        console.warn(`Script execution warning in ${componentPath}:`, error);
                    }
                });

                console.log(`✓ Loaded: ${componentPath}`);
                return true;
            }
            return false;
        })
        .catch(error => {
            console.error(`Error loading ${componentPath}:`, error);
            container.innerHTML = `<div style="padding: 1rem; text-align: center; color: #666; background: rgba(0,0,0,0.1); border-radius: 8px;">
                <p>Loading...</p>
            </div>`;
            return false;
        });
}

// Enhanced Animation Controller with Smooth Performance
class SmoothAnimationController {
    constructor() {
        this.observers = [];
        this.animatedElements = new Set();
        this.isInitialized = false;
        this.init();
    }

    init() {
        if (this.isInitialized) return;

        // Wait for components to load before initializing animations
        this.waitForComponents().then(() => {
            this.initializeScrollAnimations();
            this.initializeSmoothAnimations();
            this.initializeTextAnimations();
            this.initializeLoadingAnimations();
            this.isInitialized = true;
            console.log('✓ Smooth animations initialized');
        });
    }

    waitForComponents() {
        return new Promise((resolve) => {
            const checkComponents = () => {
                const totalContainers = document.querySelectorAll('[id$="-container"]').length;
                const loadedContainers = document.querySelectorAll('[id$="-container"]:not(:empty)').length;

                if (loadedContainers >= totalContainers * 0.8 || totalContainers === 0) {
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
            threshold: [0, 0.1, 0.2, 0.5],
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

        // Observe all animatable elements
        const elementsToAnimate = document.querySelectorAll(`
            .service-card, .feature-card, .contact-card, .testimonial-card,
            .gallery-item, .project-item, .stats-item, .benefit-item,
            .process-step, .faq-item, .area-badge, h1, h2, h3, h4, h5, h6,
            .hero-title, .section-title, .card, .content-section,
            .service-icon, .feature-icon
        `);

        elementsToAnimate.forEach((el) => {
            if (!this.animatedElements.has(el)) {
                // Set initial state for smooth animation
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px) scale(0.95)';
                el.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                el.style.willChange = 'transform, opacity';
                observer.observe(el);
            }
        });

        this.observers.push(observer);
    }

    animateElement(element) {
        // Determine animation type based on element
        let animationType = 'fadeInUp';
        let delay = 0;

        if (element.matches('h1, h2, h3, .hero-title, .section-title')) {
            animationType = 'textReveal';
            delay = 100;
        } else if (element.matches('.service-card, .feature-card')) {
            animationType = 'cardSlideIn';
            delay = 200;
        } else if (element.matches('.stats-item')) {
            animationType = 'bounceIn';
            delay = 300;
            this.animateCounter(element);
        } else if (element.matches('.gallery-item, .project-item')) {
            animationType = 'scaleIn';
            delay = 150;
        }

        // Apply smooth animation
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0) scale(1)';
            element.classList.add('animated', animationType);

            // Remove will-change after animation for performance
            setTimeout(() => {
                element.style.willChange = 'auto';
            }, 1000);
        }, delay);
    }

    initializeSmoothAnimations() {
        // Enhanced hover effects with better performance
        const interactiveElements = document.querySelectorAll(`
            .btn, .service-card, .feature-card, .contact-card,
            .testimonial-card, .gallery-item, .area-badge
        `);

        interactiveElements.forEach(el => {
            el.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

            el.addEventListener('mouseenter', () => {
                el.style.willChange = 'transform';
                if (el.matches('.btn')) {
                    el.style.transform = 'translateY(-3px) scale(1.02)';
                } else if (el.matches('.service-card, .feature-card')) {
                    el.style.transform = 'translateY(-8px) scale(1.02)';
                    el.style.boxShadow = '0 20px 40px rgba(154, 205, 50, 0.15)';
                } else {
                    el.style.transform = 'translateY(-2px) scale(1.01)';
                }
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translateY(0) scale(1)';
                el.style.boxShadow = '';
                setTimeout(() => {
                    el.style.willChange = 'auto';
                }, 300);
            });
        });
    }

    initializeTextAnimations() {
        // Smooth text reveal animations for headings
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

        headings.forEach((heading, index) => {
            heading.style.opacity = '0';
            heading.style.transform = 'translateY(20px)';
            heading.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

            setTimeout(() => {
                heading.style.opacity = '1';
                heading.style.transform = 'translateY(0)';
                heading.classList.add('text-revealed');
            }, 200 + (index * 100));
        });
    }

    initializeLoadingAnimations() {
        // Staggered loading animations for page sections
        const sections = document.querySelectorAll('.content-section, section');

        sections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

            setTimeout(() => {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, 300 + (index * 150));
        });
    }

    animateCounter(element) {
        const numberElement = element.querySelector('.stats-number, .number, [data-count]');
        if (!numberElement) return;

        const finalNumber = parseInt(numberElement.textContent.replace(/\D/g, ''));
        const duration = 2000;
        let startTime = null;
        const suffix = numberElement.textContent.replace(/[0-9]/g, '');

        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const currentNumber = Math.floor(finalNumber * this.easeOutQuart(progress));
            numberElement.textContent = currentNumber.toLocaleString() + suffix;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
        this.animatedElements.clear();
        this.isInitialized = false;
    }
}

// Enhanced Loading Screen Controller
class OptimizedLoadingScreen {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.progressFill = document.querySelector('.progress-fill');
        this.loadingPercentage = document.querySelector('.loading-percentage');
        this.progress = 0;
        this.isComplete = false;
        this.componentProgress = 0;

        if (this.loadingScreen) {
            this.init();
        }
    }

    init() {
        this.loadingScreen.style.display = 'flex';
        this.startSmartLoading();
    }

    startSmartLoading() {
        // Track actual component loading progress
        const totalComponents = 13;
        let loadedComponents = 0;

        const updateProgress = () => {
            // Combine component loading with time-based progress
            const componentProgress = (loadedComponents / totalComponents) * 70;
            const timeProgress = Math.min((Date.now() - this.startTime) / 3000 * 30, 30);

            this.progress = Math.min(componentProgress + timeProgress, 100);
            this.updateProgressBar();

            if (this.progress >= 100) {
                this.completeLoading();
            } else {
                requestAnimationFrame(updateProgress);
            }
        };

        this.startTime = Date.now();
        requestAnimationFrame(updateProgress);

        // Listen for component loads
        const observer = new MutationObserver(() => {
            const containers = document.querySelectorAll('[id$="-container"]:not(:empty)');
            loadedComponents = containers.length;
        });

        observer.observe(document.body, { 
            childList: true, 
            subtree: true 
        });

        // Ensure completion after 3 seconds max
        setTimeout(() => {
            if (!this.isComplete) {
                this.progress = 100;
                this.completeLoading();
            }
            observer.disconnect();
        }, 3000);
    }

    updateProgressBar() {
        if (this.progressFill && this.loadingPercentage) {
            this.progressFill.style.width = this.progress + '%';
            this.loadingPercentage.textContent = Math.round(this.progress) + '%';
        }
    }

    completeLoading() {
        this.isComplete = true;
        this.progress = 100;
        this.updateProgressBar();

        setTimeout(() => {
            this.hide();
        }, 500);
    }

    hide() {
        if (this.loadingScreen) {
            this.loadingScreen.style.transition = 'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            this.loadingScreen.style.opacity = '0';

            setTimeout(() => {
                this.loadingScreen.style.display = 'none';
            }, 600);
        }
    }
}

// Enhanced Component Loading with Better Error Handling
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing optimized website...');

    // Initialize loading screen
    const loadingScreen = new OptimizedLoadingScreen();

    // Component configuration
    const components = [
        { id: 'header-container', file: 'header.html', critical: true },
        { id: 'hero-container', file: 'components/hero-section.html', critical: true },
        { id: 'benefits-container', file: 'components/benefits-banner.html' },
        { id: 'services-container', file: 'components/services-overview.html' },
        { id: 'why-choose-container', file: 'components/why-choose.html' },
        { id: 'service-areas-container', file: 'components/service-areas.html' },
        { id: 'gallery-container', file: 'components/gallery.html' },
        { id: 'testimonials-container', file: 'components/testimonials.html' },
        { id: 'process-container', file: 'components/process.html' },
        { id: 'stats-container', file: 'components/stats.html' },
        { id: 'faq-container', file: 'components/faq.html' },
        { id: 'contact-cta-container', file: 'components/contact-cta.html' },
        { id: 'footer-container', file: 'footer.html' }
    ];

    let loadedCount = 0;
    const totalComponents = components.length;

    // Load critical components first
    const criticalComponents = components.filter(c => c.critical);
    const nonCriticalComponents = components.filter(c => !c.critical);

    async function loadComponentsSequentially(componentList, delay = 50) {
        for (const component of componentList) {
            try {
                await loadComponent(component.file, component.id);
                loadedCount++;
                console.log(`✅ Loaded: ${component.file} (${loadedCount}/${totalComponents})`);

                // Small delay for smooth loading
                await new Promise(resolve => setTimeout(resolve, delay));
            } catch (error) {
                console.warn(`⚠️ Failed to load: ${component.file}`);
                loadedCount++;
            }
        }
    }

    // Load components with priority
    loadComponentsSequentially(criticalComponents, 100)
        .then(() => loadComponentsSequentially(nonCriticalComponents, 50))
        .then(() => {
            console.log('🎉 All components loaded successfully!');
            initializeEnhancedFeatures();
        });
});

// Enhanced Feature Initialization
function initializeEnhancedFeatures() {
    // Initialize smooth animation controller
    window.animationController = new SmoothAnimationController();

    // Initialize other features
    initializeOptimizedScrolling();
    initializeEnhancedForms();
    initializePerformanceOptimizations();

    setTimeout(() => {
        initializeFAQSystem();
        console.log('✅ All enhanced features initialized');
    }, 200);
}

// Optimized Smooth Scrolling
function initializeOptimizedScrolling() {
    let isScrolling = false;

    document.addEventListener('click', function(e) {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const href = e.target.getAttribute('href');

            if (href && href.length > 1) {
                const target = document.querySelector(href);
                if (target && !isScrolling) {
                    isScrolling = true;
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                    const targetPosition = target.offsetTop - headerHeight - 20;

                    smoothScrollTo(targetPosition, 800, () => {
                        isScrolling = false;
                    });
                }
            }
        }
    });
}

// Enhanced Smooth Scroll Function
function smoothScrollTo(targetPosition, duration, callback) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const easeProgress = easeInOutCubic(progress);

        window.scrollTo(0, startPosition + distance * easeProgress);

        if (progress < 1) {
            requestAnimationFrame(animation);
        } else if (callback) {
            callback();
        }
    }

    requestAnimationFrame(animation);
}

// Enhanced FAQ System
function initializeFAQSystem() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach((item) => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (question && answer) {
            // Set up smooth transitions
            answer.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            answer.style.overflow = 'hidden';

            // Set initial state
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

                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        otherAnswer.style.maxHeight = '0px';
                        otherAnswer.style.opacity = '0';
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
            });
        }
    });
}

// Enhanced Form Handling
function initializeEnhancedForms() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            input.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

            input.addEventListener('focus', () => {
                input.style.transform = 'scale(1.02)';
                input.style.boxShadow = '0 0 0 3px rgba(154, 205, 50, 0.1)';
            });

            input.addEventListener('blur', () => {
                input.style.transform = 'scale(1)';
                input.style.boxShadow = 'none';
            });
        });
    });
}

// Performance Optimizations
function initializePerformanceOptimizations() {
    // Optimize images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.loading = 'lazy';
        img.decoding = 'async';
        img.style.transition = 'opacity 0.3s ease';

        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
    });

    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
            // Scroll-based animations here
        }, 16);
    }, { passive: true });
}

// Global error handling
window.addEventListener('error', (e) => {
    console.warn('Non-critical error:', e.message);
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.animationController) {
        window.animationController.destroy();
    }
});