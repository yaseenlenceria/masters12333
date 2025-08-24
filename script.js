
// Enhanced Component Loading System
function loadComponent(componentPath, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`Container ${containerId} not found for component ${componentPath}`);
        return Promise.resolve();
    }

    return fetch(componentPath + '?v=' + Date.now())
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: Failed to load ${componentPath}`);
            }
            return response.text();
        })
        .then(data => {
            if (data && data.trim()) {
                container.innerHTML = data;

                // Execute scripts with proper error handling
                const scripts = container.querySelectorAll('script');
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

                console.log(`✅ Loaded: ${componentPath}`);
                
                // Trigger component-specific initializations
                initializeComponentFeatures(container);
                
                return true;
            }
            return false;
        })
        .catch(error => {
            console.error(`❌ Error loading ${componentPath}:`, error);
            container.innerHTML = `<div class="loading-fallback">
                <p>Content loading...</p>
            </div>`;
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
            element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100);
    });
}

// Enhanced Loading Screen Controller
class PremiumLoadingScreen {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.progressFill = document.querySelector('.progress-fill');
        this.loadingPercentage = document.querySelector('.loading-percentage');
        this.progress = 0;
        this.isComplete = false;
        this.startTime = Date.now();
        this.isMobile = window.innerWidth <= 768;
        this.loadedComponents = 0;
        this.totalComponents = this.detectPageType();
        this.isHomePage = window.location.pathname === '/' || window.location.pathname.includes('index.html');
        
        // Create loading screen if it doesn't exist
        if (!this.loadingScreen && !this.isComplete) {
            this.createLoadingScreen();
        }
        
        if (this.loadingScreen) {
            console.log('🚀 Initializing Premium Loading Screen');
            this.init();
        }
    }

    detectPageType() {
        const containers = document.querySelectorAll('[id$="-container"]');
        return Math.max(containers.length, 3); // Minimum 3 components for any page
    }

    createLoadingScreen() {
        console.log('📱 Creating loading screen for this page');
        
        const loadingHTML = `
            <div id="loading-screen" class="loading-screen">
                <div class="loading-container">
                    <div class="loading-logo">
                        <img src="attached_assets/mainlogo.png" alt="The Masters Group" class="main-logo">
                        <div class="loading-text">
                            <h1>The Masters Group</h1>
                            <p>Loading Page...</p>
                        </div>
                    </div>
                    
                    <div class="loading-progress">
                        <div class="progress-bar">
                            <div class="progress-fill"></div>
                        </div>
                        <div class="loading-percentage">0%</div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('afterbegin', loadingHTML);
        this.loadingScreen = document.getElementById('loading-screen');
        this.progressFill = document.querySelector('.progress-fill');
        this.loadingPercentage = document.querySelector('.loading-percentage');
        
        // Set initial state
        document.body.style.overflow = 'hidden';
        this.loadingScreen.style.zIndex = '10000';
    }

    init() {
        this.loadingScreen.style.display = 'flex';
        this.loadingScreen.style.opacity = '1';
        this.loadingScreen.style.visibility = 'visible';
        
        // Start loading animation
        this.animateLoadingElements();
        this.startProgressTracking();
    }
    
    animateLoadingElements() {
        // Animate brand logos with staggered timing
        const brandLogos = this.loadingScreen.querySelectorAll('.brand-logo');
        brandLogos.forEach((logo, index) => {
            logo.style.opacity = '0';
            logo.style.transform = 'translateY(30px) scale(0.8)';
            logo.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            
            setTimeout(() => {
                logo.style.opacity = '1';
                logo.style.transform = 'translateY(0) scale(1)';
            }, 500 + (index * 200));
        });
    }

    startProgressTracking() {
        const updateProgress = () => {
            const timeElapsed = Date.now() - this.startTime;
            
            // Different tracking for different page types
            if (this.isHomePage) {
                const containers = document.querySelectorAll('[id$="-container"]:not(:empty)');
                this.loadedComponents = containers.length;
            } else {
                // For other pages, check if main content is loaded
                const mainContent = document.querySelector('main, .main-content, .page-content');
                const header = document.querySelector('header, .header');
                const footer = document.querySelector('footer, .footer');
                
                this.loadedComponents = 0;
                if (header) this.loadedComponents++;
                if (mainContent) this.loadedComponents++;
                if (footer) this.loadedComponents++;
                if (document.readyState === 'complete') this.loadedComponents++;
            }
            
            // Calculate realistic progress
            const componentProgress = Math.min((this.loadedComponents / this.totalComponents) * 60, 60);
            const timeProgress = Math.min((timeElapsed / 2000) * 40, 40);
            this.progress = Math.min(componentProgress + timeProgress, 100);
            
            this.updateProgressBar();
            
            // Complete when we have enough components and minimum time
            const minTime = this.isMobile ? 1000 : 800;
            const hasEnoughComponents = this.loadedComponents >= Math.max(1, this.totalComponents * 0.5);
            const hasMinTime = timeElapsed >= minTime;
            const isDocumentReady = document.readyState === 'complete';
            
            if (this.progress >= 100 || (hasEnoughComponents && hasMinTime) || (isDocumentReady && timeElapsed > minTime)) {
                this.completeLoading();
            } else if (!this.isComplete) {
                requestAnimationFrame(updateProgress);
            }
        };
        
        requestAnimationFrame(updateProgress);
        
        // Safety timeout - shorter for non-home pages
        const maxWait = this.isHomePage ? (this.isMobile ? 4000 : 3500) : (this.isMobile ? 2500 : 2000);
        setTimeout(() => {
            if (!this.isComplete) {
                console.log('⚠️ Loading timeout reached, completing...');
                this.progress = 100;
                this.completeLoading();
            }
        }, maxWait);
    }

    updateProgressBar() {
        if (this.progressFill && this.loadingPercentage) {
            this.progressFill.style.width = this.progress + '%';
            this.loadingPercentage.textContent = Math.round(this.progress) + '%';
        }
    }

    completeLoading() {
        if (this.isComplete) return;
        
        this.isComplete = true;
        this.progress = 100;
        this.updateProgressBar();
        
        console.log(`✅ Loading complete: ${this.loadedComponents}/${this.totalComponents} components loaded`);
        
        // Smooth completion animation
        setTimeout(() => {
            this.hide();
        }, this.isMobile ? 800 : 600);
    }

    hide() {
        if (!this.loadingScreen) return;
        
        console.log('🎉 Hiding loading screen with smooth animation');
        
        // Start hide animation
        this.loadingScreen.classList.add('hide');
        
        // Enhanced mobile hiding
        if (this.isMobile) {
            this.loadingScreen.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            this.loadingScreen.style.opacity = '0';
            this.loadingScreen.style.visibility = 'hidden';
            this.loadingScreen.style.transform = 'scale(0.95)';
            this.loadingScreen.style.pointerEvents = 'none';
            
            // Hide all child elements immediately on mobile
            const children = this.loadingScreen.querySelectorAll('*');
            children.forEach(child => {
                child.style.opacity = '0';
                child.style.transform = 'translateY(-20px) scale(0.9)';
            });
        }
        
        // Restore body overflow
        document.body.style.overflow = '';
        
        // Complete removal
        setTimeout(() => {
            if (this.loadingScreen && this.loadingScreen.parentNode) {
                this.loadingScreen.style.display = 'none';
                this.loadingScreen.remove();
                console.log('✅ Loading screen completely removed');
                
                // Initialize page animations
                this.initializePageAnimations();
            }
        }, this.isMobile ? 1000 : 800);
    }
    
    initializePageAnimations() {
        // Smooth page reveal
        document.body.style.opacity = '1';
        
        // Initialize scroll-based animations
        if (window.animationController) {
            window.animationController.init();
        }
        
        console.log('🎨 Page animations initialized');
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
        
        console.log('🎬 Initializing Modern Animation Controller');
        
        this.waitForComponents().then(() => {
            this.initializeScrollAnimations();
            this.initializeHoverEffects();
            this.initializeTextAnimations();
            this.isInitialized = true;
            console.log('✅ All animations initialized');
        });
    }

    waitForComponents() {
        return new Promise((resolve) => {
            let attempts = 0;
            const maxAttempts = 50;
            
            const checkComponents = () => {
                attempts++;
                const totalContainers = document.querySelectorAll('[id$="-container"]').length;
                const loadedContainers = document.querySelectorAll('[id$="-container"]:not(:empty)').length;
                
                if (loadedContainers >= Math.max(8, totalContainers * 0.7) || attempts >= maxAttempts) {
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
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animatedElements.add(entry.target);
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements with better selectors
        const elementsToAnimate = document.querySelectorAll(`
            .service-card, .feature-card, .contact-card, .testimonial-card,
            .gallery-item, .process-step, .stats-item, .faq-item,
            .area-badge, .benefit-item, section, .content-section,
            h1, h2, h3, h4, h5, h6, .hero-title, .section-title
        `);

        elementsToAnimate.forEach((el) => {
            if (!this.animatedElements.has(el)) {
                // Set initial state
                el.style.opacity = '0';
                el.style.transform = 'translateY(40px) scale(0.95)';
                el.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                observer.observe(el);
            }
        });

        this.observers.push(observer);
    }

    animateElement(element) {
        let delay = 0;
        
        // Different animations based on element type
        if (element.matches('.service-card, .feature-card')) {
            delay = 200;
            this.animateCounter(element);
        } else if (element.matches('.stats-item')) {
            delay = 300;
            this.animateCounter(element);
        } else if (element.matches('h1, h2, h3, .section-title')) {
            delay = 100;
        }

        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0) scale(1)';
            element.classList.add('animated');
        }, delay);
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
                    el.style.transform = 'translateY(-10px) scale(1.02)';
                    el.style.boxShadow = '0 25px 50px rgba(154, 205, 50, 0.2)';
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

    initializeTextAnimations() {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach((heading, index) => {
            setTimeout(() => {
                heading.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                heading.style.opacity = '1';
                heading.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    animateCounter(element) {
        const numberElement = element.querySelector('.stats-number, .number, [data-count]');
        if (!numberElement) return;

        const finalNumber = parseInt(numberElement.textContent.replace(/\D/g, ''));
        if (isNaN(finalNumber)) return;
        
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

// Enhanced FAQ System
function initializeFAQItem(item) {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (question && answer) {
        answer.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
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
        card.style.transform = 'translateY(-10px) scale(1.02)';
        card.style.boxShadow = '0 20px 40px rgba(154, 205, 50, 0.15)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = '';
    });
}

// Enhanced Component Loading System
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Premium Website Experience');
    
    // Set initial page state
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    // Initialize premium loading screen
    const loadingScreen = new PremiumLoadingScreen();
    
    // Initialize animation controller
    window.animationController = new ModernAnimationController();

    // Detect if this is the home page
    const isHomePage = window.location.pathname === '/' || window.location.pathname.includes('index.html');

    if (isHomePage) {
        // Component configuration with priorities for home page
        const components = [
            { id: 'header-container', file: 'header.html', priority: 1 },
            { id: 'hero-container', file: 'components/hero-section.html', priority: 1 },
            { id: 'benefits-container', file: 'components/benefits-banner.html', priority: 2 },
            { id: 'services-container', file: 'components/services-overview.html', priority: 2 },
            { id: 'why-choose-container', file: 'components/why-choose.html', priority: 3 },
            { id: 'service-areas-container', file: 'components/service-areas.html', priority: 3 },
            { id: 'gallery-container', file: 'components/gallery.html', priority: 3 },
            { id: 'testimonials-container', file: 'components/testimonials.html', priority: 4 },
            { id: 'process-container', file: 'components/process.html', priority: 4 },
            { id: 'stats-container', file: 'components/stats.html', priority: 4 },
            { id: 'faq-container', file: 'components/faq.html', priority: 5 },
            { id: 'contact-cta-container', file: 'components/contact-cta.html', priority: 2 },
            { id: 'footer-container', file: 'footer.html', priority: 5 }
        ];

        let loadedCount = 0;
        const totalComponents = components.length;

        // Load components by priority
        async function loadComponentsByPriority() {
            const priorities = [...new Set(components.map(c => c.priority))].sort();
            
            for (const priority of priorities) {
                const priorityComponents = components.filter(c => c.priority === priority);
                
                await Promise.all(priorityComponents.map(async (component) => {
                    try {
                        await loadComponent(component.file, component.id);
                        loadedCount++;
                        console.log(`✅ Priority ${priority}: ${component.file} (${loadedCount}/${totalComponents})`);
                    } catch (error) {
                        console.warn(`⚠️ Failed to load: ${component.file}`);
                        loadedCount++;
                    }
                }));
                
                // Small delay between priority groups
                if (priority < Math.max(...priorities)) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }
            
            console.log('🎉 All components loaded successfully!');
            initializeEnhancedFeatures();
        }

        loadComponentsByPriority();
    } else {
        // For other pages, just wait for document ready and initialize features
        console.log('📄 Non-home page detected, using simplified loading');
        
        // Simple loading for other pages
        setTimeout(() => {
            initializeEnhancedFeatures();
        }, 500);
        
        // Monitor document ready state
        if (document.readyState === 'complete') {
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 800);
        } else {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    document.body.style.opacity = '1';
                }, 800);
            });
        }
    }
});

// Initialize Enhanced Features
function initializeEnhancedFeatures() {
    // Initialize scroll behavior
    initializeOptimizedScrolling();
    
    // Initialize forms
    initializeEnhancedForms();
    
    // Initialize performance optimizations
    initializePerformanceOptimizations();
    
    // Initialize all FAQ systems
    setTimeout(() => {
        document.querySelectorAll('.faq-item').forEach(initializeFAQItem);
        console.log('✅ Enhanced features initialized');
    }, 300);
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

// Smooth Scroll Function
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

// Enhanced Form Handling
function initializeEnhancedForms() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            input.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

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
}

// Performance Optimizations
function initializePerformanceOptimizations() {
    // Optimize images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.loading = 'lazy';
        img.decoding = 'async';
        
        if (!img.style.transition) {
            img.style.transition = 'opacity 0.3s ease';
        }

        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
        
        img.addEventListener('error', () => {
            img.style.opacity = '0.5';
        });
    });

    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
            // Scroll-based optimizations
        }, 16);
    }, { passive: true });
}

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

// Expose for debugging
window.debugInfo = {
    loadingScreen: null,
    animationController: null,
    getLoadedComponents: () => document.querySelectorAll('[id$="-container"]:not(:empty)').length
};
