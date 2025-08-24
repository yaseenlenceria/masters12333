
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
                    container.style.transition = 'opacity 0.3s ease, visibility 0.3s ease';
                    container.style.opacity = '1';
                    container.style.visibility = 'visible';
                });

                console.log(`✅ Loaded: ${componentPath}`);
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
            element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100);
    });
}

// Enhanced Loading Screen Controller
class PremiumLoadingScreen {
    constructor() {
        // Improved home page detection
        const path = window.location.pathname;
        this.isHomePage = path === '/' || path === '/index.html' || path === '' || path.endsWith('/');
        
        console.log(`🏠 Page detected: ${path}, isHomePage: ${this.isHomePage}`);
        
        // Only initialize loading screen for home page
        if (!this.isHomePage) {
            console.log('📄 Non-home page detected, skipping loading screen');
            this.isComplete = true;
            return;
        }
        
        this.loadingScreen = document.getElementById('loading-screen');
        this.progress = 0;
        this.isComplete = false;
        this.startTime = Date.now();
        this.isMobile = window.innerWidth <= 768;
        this.loadedComponents = 0;
        this.totalComponents = 13; // Fixed count for home page
        this.componentTracker = new Set();
        
        // Initialize elements after ensuring loading screen exists
        this.initializeElements();
        
        if (this.loadingScreen) {
            console.log('🚀 Initializing Premium Loading Screen for Home Page');
            this.init();
        } else {
            console.error('❌ Loading screen not found, creating fallback');
            this.createLoadingScreen();
            this.initializeElements();
            this.init();
        }
    }
    
    initializeElements() {
        this.progressFill = document.querySelector('.progress-fill');
        this.loadingPercentage = document.querySelector('.loading-percentage');
        
        if (!this.progressFill || !this.loadingPercentage) {
            console.warn('⚠️ Loading screen elements not found, will retry');
            setTimeout(() => {
                this.progressFill = document.querySelector('.progress-fill');
                this.loadingPercentage = document.querySelector('.loading-percentage');
            }, 100);
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
            
            // Faster component tracking for home page
            if (this.isHomePage) {
                // Count actual loaded containers
                const containers = document.querySelectorAll('[id$="-container"]');
                let loadedCount = 0;
                
                containers.forEach(container => {
                    if (container.innerHTML.trim() !== '') {
                        const containerId = container.id;
                        if (!this.componentTracker.has(containerId)) {
                            this.componentTracker.add(containerId);
                            loadedCount++;
                        }
                    }
                });
                
                this.loadedComponents = this.componentTracker.size;
                
                // Check for critical components specifically
                const header = document.querySelector('header, .header, #main-header');
                const hero = document.querySelector('#hero-container');
                const hasHeader = header && header.innerHTML.trim() ? 1 : 0;
                const hasHero = hero && hero.innerHTML.trim() ? 1 : 0;
                
                // Faster progress calculation
                const componentProgress = Math.min((this.loadedComponents / this.totalComponents) * 70, 70);
                const criticalProgress = (hasHeader + hasHero) * 15; // 30% for critical components
                this.progress = Math.min(componentProgress + criticalProgress, 100);
            } else {
                // For other pages, much faster completion
                const header = document.querySelector('header, .header');
                const hasHeader = header && header.innerHTML.trim() ? 1 : 0;
                
                this.loadedComponents = hasHeader ? 3 : 1;
                this.progress = Math.min((timeElapsed / 800) * 100, 100);
            }
            
            this.updateProgressBar();
            
            // Much faster completion logic
            const minTime = this.isMobile ? 800 : 600; // Reduced minimum time
            const hasEnoughComponents = this.loadedComponents >= Math.max(3, this.totalComponents * 0.4);
            const hasMinTime = timeElapsed >= minTime;
            const isDocumentReady = document.readyState === 'complete';
            const hasHeader = document.querySelector('header, .header, #main-header');
            
            // For home page, ensure header is loaded before completing
            const canComplete = this.isHomePage ? 
                (hasHeader && hasEnoughComponents && hasMinTime) :
                (hasMinTime);
            
            if (this.progress >= 90 || canComplete || (isDocumentReady && timeElapsed > minTime && hasHeader)) {
                this.completeLoading();
            } else if (!this.isComplete) {
                requestAnimationFrame(updateProgress);
            }
        };
        
        requestAnimationFrame(updateProgress);
        
        // Much shorter timeout for faster UX
        const maxWait = this.isHomePage ? (this.isMobile ? 2500 : 2000) : (this.isMobile ? 1200 : 1000);
        setTimeout(() => {
            if (!this.isComplete) {
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
        if (!this.loadingScreen) {
            console.warn('⚠️ No loading screen to hide, showing page anyway');
            this.initializePageAnimations();
            return;
        }
        
        console.log('🎉 Hiding loading screen with smooth animation');
        
        // Start hide animation
        this.loadingScreen.classList.add('hide');
        
        // Apply hiding styles immediately
        this.loadingScreen.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        this.loadingScreen.style.opacity = '0';
        this.loadingScreen.style.visibility = 'hidden';
        this.loadingScreen.style.transform = 'scale(0.95)';
        this.loadingScreen.style.pointerEvents = 'none';
        
        // Enhanced mobile hiding
        if (this.isMobile) {
            // Hide all child elements immediately on mobile
            const children = this.loadingScreen.querySelectorAll('*');
            children.forEach(child => {
                child.style.opacity = '0';
                child.style.transform = 'translateY(-20px) scale(0.9)';
                child.style.transition = 'all 0.3s ease';
            });
        }
        
        // Restore body overflow and show page immediately
        document.body.style.overflow = '';
        
        // Show page content immediately
        setTimeout(() => {
            this.initializePageAnimations();
        }, 200);
        
        // Complete removal
        setTimeout(() => {
            if (this.loadingScreen && this.loadingScreen.parentNode) {
                this.loadingScreen.style.display = 'none';
                this.loadingScreen.remove();
                console.log('✅ Loading screen completely removed');
            }
        }, this.isMobile ? 1000 : 800);
    }
    
    initializePageAnimations() {
        // Enable animations again
        document.documentElement.style.removeProperty('--disable-animations');
        
        // Smooth page reveal without blinking
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease, visibility 0.5s ease';
            document.body.style.opacity = '1';
            document.body.style.visibility = 'visible';
        }, 100);
        
        // Initialize scroll-based animations after page is visible
        if (window.animationController) {
            setTimeout(() => {
                window.animationController.init();
            }, 300);
        }
        
        // Initialize enhanced features
        setTimeout(() => {
            initializeEnhancedFeatures();
        }, 400);
        
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

// Prevent double initialization
let isInitialized = false;
let currentLoadingScreen = null;

// Enhanced Component Loading System
document.addEventListener('DOMContentLoaded', function() {
    if (isInitialized) {
        console.log('⚠️ Already initialized, skipping...');
        return;
    }
    isInitialized = true;
    
    console.log('🚀 Initializing Premium Website Experience');
    
    // Detect if this is the home page first
    const path = window.location.pathname;
    const isHomePage = path === '/' || path === '/index.html' || path === '' || path.endsWith('/');
    
    console.log(`🏠 DOMContentLoaded - Page: ${path}, isHomePage: ${isHomePage}`);
    
    // CRITICAL: Hide page content immediately to prevent blinking
    document.body.style.opacity = '0';
    document.body.style.visibility = 'hidden';
    document.body.style.transition = 'none'; // Remove transition to prevent blinking
    
    // Prevent any animations during loading
    document.documentElement.style.setProperty('--disable-animations', '1');

    // Initialize premium loading screen (only for home page)
    if (isHomePage && !currentLoadingScreen) {
        // Force loading screen to be visible immediately
        const existingLoadingScreen = document.getElementById('loading-screen');
        if (existingLoadingScreen) {
            existingLoadingScreen.style.display = 'flex !important';
            existingLoadingScreen.style.opacity = '1 !important';
            existingLoadingScreen.style.visibility = 'visible !important';
            existingLoadingScreen.style.zIndex = '10000 !important';
            existingLoadingScreen.style.position = 'fixed !important';
            console.log('✅ Loading screen forced visible');
        }
        
        currentLoadingScreen = new PremiumLoadingScreen();
        console.log('🎬 Loading screen initialized for home page');
    } else if (!isHomePage) {
        // For non-home pages, show content immediately
        setTimeout(() => {
            document.body.style.visibility = 'visible';
            document.body.style.opacity = '1';
            document.body.style.transition = 'opacity 0.2s ease';
        }, 50);
    }
    
    // Initialize animation controller only once
    if (!window.animationController) {
        window.animationController = new ModernAnimationController();
    }

    if (isHomePage) {
        // Component configuration with priorities for home page - Header first!
        const components = [
            { id: 'header-container', file: 'header.html', priority: 1, critical: true },
            { id: 'hero-container', file: 'components/hero-section.html', priority: 1, critical: true },
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

        let loadedCount = 0;
        const totalComponents = components.length;

        // Load components by priority - OPTIMIZED
        async function loadComponentsByPriority() {
            const priorities = [...new Set(components.map(c => c.priority))].sort();
            
            // Hide all containers initially to prevent blinking
            components.forEach(component => {
                const container = document.getElementById(component.id);
                if (container) {
                    container.style.opacity = '0';
                    container.style.visibility = 'hidden';
                }
            });
            
            // Load critical components first (header + hero) immediately
            const criticalComponents = components.filter(c => c.priority === 1);
            await Promise.all(criticalComponents.map(async (component) => {
                try {
                    await loadComponent(component.file, component.id);
                    loadedCount++;
                    
                    // Show container immediately
                    const container = document.getElementById(component.id);
                    if (container) {
                        container.style.transition = 'opacity 0.2s ease, visibility 0.2s ease';
                        container.style.opacity = '1';
                        container.style.visibility = 'visible';
                    }
                    
                    // Initialize header immediately when loaded
                    if (component.id === 'header-container') {
                        setTimeout(() => {
                            if (window.initModernHeader) {
                                window.initModernHeader();
                            } else {
                                initializeHeaderFallback();
                            }
                        }, 100);
                    }
                } catch (error) {
                    console.warn(`⚠️ Failed to load: ${component.file}`);
                    loadedCount++;
                }
            }));
            
            // Load remaining components in background without blocking
            const remainingComponents = components.filter(c => c.priority > 1);
            loadRemainingComponentsAsync(remainingComponents);
            
            // Re-enable animations immediately after critical components
            setTimeout(() => {
                document.documentElement.style.removeProperty('--disable-animations');
                initializeEnhancedFeatures();
            }, 200);
        }
        
        // Load remaining components asynchronously without blocking UI
        function loadRemainingComponentsAsync(remainingComponents) {
            const priorities = [...new Set(remainingComponents.map(c => c.priority))].sort();
            
            let currentPriorityIndex = 0;
            
            function loadNextBatch() {
                if (currentPriorityIndex >= priorities.length) {
                    console.log('🎉 All components loaded successfully!');
                    return;
                }
                
                const priority = priorities[currentPriorityIndex];
                const priorityComponents = remainingComponents.filter(c => c.priority === priority);
                
                Promise.all(priorityComponents.map(async (component) => {
                    try {
                        await loadComponent(component.file, component.id);
                        loadedCount++;
                        
                        // Show container smoothly
                        const container = document.getElementById(component.id);
                        if (container) {
                            container.style.transition = 'opacity 0.2s ease, visibility 0.2s ease';
                            container.style.opacity = '1';
                            container.style.visibility = 'visible';
                        }
                    } catch (error) {
                        console.warn(`⚠️ Failed to load: ${component.file}`);
                        loadedCount++;
                    }
                })).then(() => {
                    currentPriorityIndex++;
                    // Load next batch with minimal delay
                    setTimeout(loadNextBatch, 25);
                });
            }
            
            loadNextBatch();
        }

        loadComponentsByPriority();
    } else {
        // For other pages, load immediately
        console.log('📄 Non-home page detected, fast loading');
        
        // Show page content immediately
        document.body.style.opacity = '1';
        document.body.style.visibility = 'visible';
        
        // Load header and footer for service pages immediately
        const hasHeader = document.getElementById('header-container');
        const hasFooter = document.getElementById('footer-container');
        
        if (hasHeader) {
            loadComponent('header.html', 'header-container').then(() => {
                setTimeout(() => {
                    if (window.initModernHeader) {
                        window.initModernHeader();
                    } else {
                        initializeHeaderFallback();
                    }
                }, 50);
            });
        }
        if (hasFooter) {
            loadComponent('footer.html', 'footer-container');
        }
        
        // Fast loading for other pages
        setTimeout(() => {
            document.documentElement.style.removeProperty('--disable-animations');
            initializeEnhancedFeatures();
        }, 100);
        
        // Initialize animations immediately for non-home pages
        setTimeout(() => {
            if (window.animationController) {
                window.animationController.init();
            }
        }, 200);
    }
});

// Header Fallback Initialization
function initializeHeaderFallback() {
    console.log('🔧 Initializing header fallback');
    
    const header = document.querySelector('#main-header, header, .header');
    if (!header) {
        console.warn('⚠️ No header found for fallback initialization');
        return;
    }
    
    // Mobile menu functionality
    const mobileMenuBtn = header.querySelector('#mobile-menu-btn, .mobile-menu-btn');
    const mobileMenu = header.querySelector('#mobile-menu, .mobile-menu');
    const mobileOverlay = header.querySelector('#mobile-overlay, .mobile-overlay');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            mobileMenuBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            if (mobileOverlay) mobileOverlay.classList.toggle('active');
            
            // Prevent body scroll
            if (mobileMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }
    
    // Mobile services toggle
    const servicesToggle = header.querySelector('.mobile-services-toggle');
    const servicesMenu = header.querySelector('.mobile-services-menu');
    const servicesDiv = header.querySelector('.mobile-services');
    
    if (servicesToggle && servicesDiv) {
        servicesToggle.addEventListener('click', (e) => {
            e.preventDefault();
            servicesDiv.classList.toggle('active');
        });
    }
    
    // Close menu on overlay click
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', () => {
            if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
            if (mobileMenu) mobileMenu.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close menu on nav link clicks
    const navLinks = header.querySelectorAll('.mobile-nav-link, .mobile-service-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
            if (mobileMenu) mobileMenu.classList.remove('active');
            if (mobileOverlay) mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Scroll effects
    let lastScrollY = 0;
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
    }, { passive: true });
    
    console.log('✅ Header fallback initialized');
}

// Initialize Enhanced Features
function initializeEnhancedFeatures() {
    // Initialize scroll behavior
    initializeOptimizedScrolling();
    
    // Initialize forms
    initializeEnhancedForms();
    
    // Initialize performance optimizations
    initializePerformanceOptimizations();
    
    // Ensure header is working
    setTimeout(() => {
        const header = document.querySelector('#main-header, header, .header');
        if (header && !window.modernHeaderController) {
            initializeHeaderFallback();
        }
    }, 100);
    
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

// Global header initialization function
window.initModernHeader = function() {
    if (window.modernHeaderController) {
        console.log('🔧 Header controller already exists');
        return;
    }
    
    // Try to initialize the header controller from header.html
    if (typeof ModernHeaderController !== 'undefined') {
        window.modernHeaderController = new ModernHeaderController();
        console.log('✅ Modern header controller initialized');
    } else {
        // Use fallback
        console.log('🔧 Using header fallback initialization');
        initializeHeaderFallback();
    }
};

// Expose for debugging
window.debugInfo = {
    loadingScreen: null,
    animationController: null,
    getLoadedComponents: () => document.querySelectorAll('[id$="-container"]:not(:empty)').length,
    headerController: () => window.modernHeaderController
};
