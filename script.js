// Simple Component Loading System
function loadComponent(componentPath, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`Container ${containerId} not found for component ${componentPath}`);
        return Promise.resolve();
    }

    return fetch(componentPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: Failed to load ${componentPath}`);
            }
            return response.text();
        })
        .then(data => {
            if (data && data.trim()) {
                container.innerHTML = data;

                // Execute scripts
                const scripts = container.querySelectorAll('script');
                scripts.forEach(script => {
                    try {
                        const newScript = document.createElement('script');
                        if (script.src) {
                            newScript.src = script.src;
                        } else {
                            newScript.textContent = script.textContent;
                        }
                        document.body.appendChild(newScript);
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
            container.innerHTML = `<div style="padding: 1rem; text-align: center; color: #666;">
                <p>Content loading...</p>
            </div>`;
            return false;
        });
}

// Simple Loading Screen
class SimpleLoadingScreen {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.progressFill = document.querySelector('.progress-fill');
        this.loadingPercentage = document.querySelector('.loading-percentage');
        this.progress = 0;

        if (this.loadingScreen) {
            this.init();
        }
    }

    init() {
        this.loadingScreen.style.display = 'flex';
        this.startLoading();
    }

    startLoading() {
        const duration = 2000; // 2 seconds
        const startTime = Date.now();

        const updateProgress = () => {
            const elapsed = Date.now() - startTime;
            this.progress = Math.min((elapsed / duration) * 100, 100);
            this.updateProgressBar();

            if (this.progress >= 100) {
                this.completeLoading();
            } else {
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

    completeLoading() {
        setTimeout(() => {
            this.hide();
        }, 300);
    }

    hide() {
        if (this.loadingScreen) {
            this.loadingScreen.style.opacity = '0';
            setTimeout(() => {
                this.loadingScreen.style.display = 'none';
            }, 500);
        }
    }
}

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing website...');

    // Initialize loading screen
    new SimpleLoadingScreen();

    // Component configuration
    const components = [
        { id: 'header-container', file: 'header.html' },
        { id: 'hero-container', file: 'components/hero-section.html' },
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

    // Load all components
    async function loadAllComponents() {
        for (const component of components) {
            await loadComponent(component.file, component.id);
            await new Promise(resolve => setTimeout(resolve, 50)); // Small delay
        }

        console.log('All components loaded');
        initializeBasicFeatures();
    }

    loadAllComponents();
});

// Basic features initialization
function initializeBasicFeatures() {
    // Simple smooth scrolling
    document.addEventListener('click', function(e) {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const href = e.target.getAttribute('href');

            if (href && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                    const targetPosition = target.offsetTop - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        }
    });

    // Simple FAQ functionality
    setTimeout(() => {
        initializeFAQ();
    }, 100);

    // Basic form handling
    initializeForms();
}

// Simple FAQ system
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach((item) => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (question && answer) {
            question.addEventListener('click', (e) => {
                e.preventDefault();
                const isActive = item.classList.contains('active');

                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        if (otherAnswer) {
                            otherAnswer.style.display = 'none';
                        }
                    }
                });

                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                    answer.style.display = 'block';
                } else {
                    item.classList.remove('active');
                    answer.style.display = 'none';
                }
            });
        }
    });
}

// Basic form handling
function initializeForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.style.borderColor = '#9ACD32';
            });

            input.addEventListener('blur', () => {
                input.style.borderColor = '';
            });
        });
    });
}