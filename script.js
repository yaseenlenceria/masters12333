
// Component Loading System with Enhanced Error Handling
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
                container.setAttribute('data-loaded', 'true');

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
            container.innerHTML = `<div class="loading-placeholder">
                <div class="loading-spinner"></div>
                <p>Loading content...</p>
            </div>`;
            return false;
        });
}

// Enhanced Animation Controller with Better Performance
class EnhancedAnimationController {
    constructor() {
        this.observers = [];
        this.animatedElements = new Set();
        this.isInitialized = false;
        this.animationQueue = [];
        this.rafId = null;
    }

    init() {
        if (this.isInitialized) return;

        // Wait for critical components before initializing
        this.waitForCriticalComponents().then(() => {
            this.initializeScrollAnimations();
            this.initializeLoadingAnimations();
            this.initializeInteractionAnimations();
            this.startAnimationLoop();
            this.isInitialized = true;
            console.log('✅ Enhanced animations initialized');
        });
    }

    waitForCriticalComponents() {
        return new Promise((resolve) => {
            let attempts = 0;
            const maxAttempts = 50;
            
            const checkComponents = () => {
                const criticalContainers = [
                    'header-container',
                    'hero-container',
                    'services-container'
                ];
                
                const loadedCritical = criticalContainers.filter(id => {
                    const container = document.getElementById(id);
                    return container && container.getAttribute('data-loaded') === 'true';
                }).length;

                attempts++;
                
                if (loadedCritical >= 2 || attempts >= maxAttempts) {
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
            threshold: [0, 0.1, 0.3, 0.5],
            rootMargin: '50px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
                    if (!this.animatedElements.has(entry.target)) {
                        this.animatedElements.add(entry.target);
                        this.queueAnimation(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe elements with better selector
        setTimeout(() => {
            const elementsToAnimate = document.querySelectorAll(`
                .service-card, .feature-card, .contact-card, .testimonial-card,
                .gallery-item, .project-item, .stats-item, .benefit-item,
                .process-step, .faq-item, .area-badge, section,
                .hero-title, .section-title, .hero-subtitle
            `);

            elementsToAnimate.forEach((el) => {
                if (!this.animatedElements.has(el) && !el.classList.contains('no-animate')) {
                    this.prepareElementForAnimation(el);
                    observer.observe(el);
                }
            });
        }, 500);

        this.observers.push(observer);
    }

    prepareElementForAnimation(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(40px) scale(0.95)';
        element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        element.style.willChange = 'transform, opacity';
    }

    queueAnimation(element) {
        this.animationQueue.push({
            element,
            timestamp: performance.now()
        });
    }

    startAnimationLoop() {
        const processQueue = () => {
            if (this.animationQueue.length > 0) {
                const batch = this.animationQueue.splice(0, 3); // Process 3 at a time
                batch.forEach(({ element }, index) => {
                    setTimeout(() => {
                        this.animateElement(element);
                    }, index * 100);
                });
            }
            
            this.rafId = requestAnimationFrame(processQueue);
        };
        
        processQueue();
    }

    animateElement(element) {
        if (!element || this.animatedElements.has(element)) return;

        let animationType = 'fadeInUp';
        let delay = 0;

        // Determine animation based on element type
        if (element.matches('h1, h2, h3, .hero-title, .section-title')) {
            animationType = 'slideInDown';
            delay = 0;
        } else if (element.matches('.service-card, .feature-card')) {
            animationType = 'slideInUp';
            delay = 100;
        } else if (element.matches('.stats-item')) {
            animationType = 'bounceIn';
            delay = 200;
            this.animateCounter(element);
        } else if (element.matches('.gallery-item, .project-item')) {
            animationType = 'zoomIn';
            delay = 150;
        } else if (element.matches('.area-badge')) {
            animationType = 'slideInRight';
            delay = 50;
        }

        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0) scale(1)';
            element.classList.add('animated', animationType);

            // Clean up performance flags
            setTimeout(() => {
                element.style.willChange = 'auto';
            }, 1000);
        }, delay);
    }

    initializeLoadingAnimations() {
        // Stagger section animations
        const sections = document.querySelectorAll('section, .content-section');
        sections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

            setTimeout(() => {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, 200 + (index * 150));
        });
    }

    initializeInteractionAnimations() {
        // Enhanced hover effects
        const interactiveElements = document.querySelectorAll(`
            .btn, .service-card, .feature-card, .contact-card,
            .testimonial-card, .gallery-item, .area-badge
        `);

        interactiveElements.forEach(el => {
            el.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            
            el.addEventListener('mouseenter', () => {
                el.style.willChange = 'transform';
                this.applyHoverAnimation(el);
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
                el.style.boxShadow = '';
                setTimeout(() => {
                    el.style.willChange = 'auto';
                }, 300);
            });
        });
    }

    applyHoverAnimation(element) {
        if (element.matches('.btn')) {
            element.style.transform = 'translateY(-3px) scale(1.02)';
            element.style.boxShadow = '0 15px 30px rgba(154, 205, 50, 0.3)';
        } else if (element.matches('.service-card, .feature-card')) {
            element.style.transform = 'translateY(-10px) rotateY(2deg)';
            element.style.boxShadow = '0 25px 50px rgba(154, 205, 50, 0.15)';
        } else if (element.matches('.area-badge')) {
            element.style.transform = 'translateY(-3px) scale(1.05)';
            element.style.boxShadow = '0 10px 20px rgba(154, 205, 50, 0.2)';
        } else {
            element.style.transform = 'translateY(-5px) scale(1.02)';
        }
    }

    animateCounter(element) {
        const numberElement = element.querySelector('.stats-number, .number, [data-count]');
        if (!numberElement) return;

        const text = numberElement.textContent;
        const finalNumber = parseInt(text.replace(/\D/g, ''));
        if (isNaN(finalNumber)) return;

        const suffix = text.replace(/[0-9]/g, '');
        const duration = 2000;
        let startTime = null;

        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const currentNumber = Math.floor(finalNumber * this.easeOutCubic(progress));
            numberElement.textContent = currentNumber.toLocaleString() + suffix;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    destroy() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
        this.animatedElements.clear();
        this.animationQueue = [];
        this.isInitialized = false;
    }
}

// Improved Loading Screen Controller
class ImprovedLoadingScreen {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.progressFill = document.querySelector('.progress-fill');
        this.loadingPercentage = document.querySelector('.loading-percentage');
        this.progress = 0;
        this.isComplete = false;
        this.startTime = Date.now();

        if (this.loadingScreen) {
            this.init();
        }
    }

    init() {
        this.loadingScreen.style.display = 'flex';
        this.startProgressTracking();
    }

    startProgressTracking() {
        const totalComponents = 13;
        let lastComponentCount = 0;

        const updateProgress = () => {
            // Track loaded components
            const loadedContainers = document.querySelectorAll('[id$="-container"][data-loaded="true"]');
            const componentCount = loadedContainers.length;
            
            // Calculate progress based on components and time
            const componentProgress = (componentCount / totalComponents) * 80;
            const timeProgress = Math.min((Date.now() - this.startTime) / 2500 * 20, 20);
            
            this.progress = Math.min(componentProgress + timeProgress, 100);
            
            // Smooth progress updates
            if (componentCount > lastComponentCount) {
                this.progress += 5; // Boost for new components
                lastComponentCount = componentCount;
            }
            
            this.updateProgressBar();

            if (this.progress >= 100 || componentCount >= totalComponents) {
                this.completeLoading();
            } else {
                requestAnimationFrame(updateProgress);
            }
        };

        requestAnimationFrame(updateProgress);

        // Force completion after 3 seconds
        setTimeout(() => {
            if (!this.isComplete) {
                this.completeLoading();
            }
        }, 3000);
    }

    updateProgressBar() {
        if (this.progressFill && this.loadingPercentage) {
            this.progressFill.style.width = Math.min(this.progress, 100) + '%';
            this.loadingPercentage.textContent = Math.round(Math.min(this.progress, 100)) + '%';
        }
    }

    completeLoading() {
        if (this.isComplete) return;
        
        this.isComplete = true;
        this.progress = 100;
        this.updateProgressBar();

        setTimeout(() => {
            this.hide();
        }, 300);
    }

    hide() {
        if (this.loadingScreen) {
            this.loadingScreen.style.transition = 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            this.loadingScreen.style.opacity = '0';

            setTimeout(() => {
                this.loadingScreen.style.display = 'none';
                document.body.classList.add('loaded');
            }, 800);
        }
    }
}

// Enhanced Component Loading with Retry Logic
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing components...');

    // Initialize improved loading screen
    const loadingScreen = new ImprovedLoadingScreen();

    // Component configuration with priorities
    const components = [
        { id: 'header-container', file: 'header.html', priority: 1, critical: true },
        { id: 'hero-container', file: 'components/hero-section.html', priority: 1, critical: true },
        { id: 'benefits-container', file: 'components/benefits-banner.html', priority: 2 },
        { id: 'services-container', file: 'components/services-overview.html', priority: 1, critical: true },
        { id: 'why-choose-container', file: 'components/why-choose.html', priority: 2 },
        { id: 'service-areas-container', file: 'components/service-areas.html', priority: 2 },
        { id: 'gallery-container', file: 'components/gallery.html', priority: 3 },
        { id: 'testimonials-container', file: 'components/testimonials.html', priority: 3 },
        { id: 'process-container', file: 'components/process.html', priority: 3 },
        { id: 'stats-container', file: 'components/stats.html', priority: 3 },
        { id: 'faq-container', file: 'components/faq.html', priority: 3 },
        { id: 'contact-cta-container', file: 'components/contact-cta.html', priority: 2 },
        { id: 'footer-container', file: 'footer.html', priority: 2 }
    ];

    console.log('Starting component loading...');
    
    let loadedCount = 0;
    const totalComponents = components.length;

    async function loadComponentWithRetry(component, retries = 2) {
        for (let i = 0; i <= retries; i++) {
            try {
                const success = await loadComponent(component.file, component.id);
                if (success) {
                    loadedCount++;
                    console.log(`✓ Loaded: ${component.file} (${loadedCount}/${totalComponents})`);
                    return true;
                }
            } catch (error) {
                if (i === retries) {
                    console.warn(`⚠️ Failed to load after ${retries + 1} attempts: ${component.file}`);
                    loadedCount++;
                }
                await new Promise(resolve => setTimeout(resolve, 200 * (i + 1)));
            }
        }
        return false;
    }

    // Load components by priority
    async function loadByPriority(priority) {
        const priorityComponents = components.filter(c => c.priority === priority);
        const promises = priorityComponents.map(component => 
            loadComponentWithRetry(component)
        );
        await Promise.allSettled(promises);
    }

    // Load in priority order
    loadByPriority(1)
        .then(() => loadByPriority(2))
        .then(() => loadByPriority(3))
        .then(() => {
            console.log('All components loaded, initializing animations...');
            initializeEnhancedFeatures();
        });
});

// Enhanced Feature Initialization
function initializeEnhancedFeatures() {
    // Initialize animation controller
    window.animationController = new EnhancedAnimationController();
    window.animationController.init();

    // Initialize other enhanced features
    setTimeout(() => {
        initializeOptimizedScrolling();
        initializeEnhancedForms();
        initializeFAQSystem();
        initializeImageOptimization();
        console.log('✅ All enhanced features initialized');
    }, 300);
}

// Enhanced Smooth Scrolling
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

                    smoothScrollTo(targetPosition, 1000, () => {
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
            // Enhanced smooth transitions
            answer.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            answer.style.overflow = 'hidden';

            // Set initial state
            if (!item.classList.contains('active')) {
                answer.style.maxHeight = '0px';
                answer.style.opacity = '0';
                answer.style.paddingTop = '0px';
                answer.style.paddingBottom = '0px';
            }

            question.addEventListener('click', (e) => {
                e.preventDefault();
                const isActive = item.classList.contains('active');

                // Close others
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        otherAnswer.style.maxHeight = '0px';
                        otherAnswer.style.opacity = '0';
                        otherAnswer.style.paddingTop = '0px';
                        otherAnswer.style.paddingBottom = '0px';
                        otherItem.classList.remove('active');
                    }
                });

                // Toggle current
                if (!isActive) {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    answer.style.opacity = '1';
                    answer.style.paddingTop = '1rem';
                    answer.style.paddingBottom = '1rem';
                } else {
                    item.classList.remove('active');
                    answer.style.maxHeight = '0px';
                    answer.style.opacity = '0';
                    answer.style.paddingTop = '0px';
                    answer.style.paddingBottom = '0px';
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
            input.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

            input.addEventListener('focus', () => {
                input.style.transform = 'scale(1.02)';
                input.style.boxShadow = '0 0 0 3px rgba(154, 205, 50, 0.2)';
            });

            input.addEventListener('blur', () => {
                input.style.transform = 'scale(1)';
                input.style.boxShadow = 'none';
            });
        });
    });
}

// Image Optimization
function initializeImageOptimization() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.loading = 'lazy';
        img.decoding = 'async';
        
        if (!img.complete) {
            img.style.opacity = '0';
            img.style.transform = 'scale(0.95)';
            img.style.transition = 'all 0.3s ease';
            
            img.addEventListener('load', () => {
                img.style.opacity = '1';
                img.style.transform = 'scale(1)';
            });
        }
    });
}

// Global error handling
window.addEventListener('error', (e) => {
    console.warn('Non-critical error handled:', e.message);
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.animationController) {
        window.animationController.destroy();
    }
});
