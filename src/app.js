/**
 * Main application entry point
 */
import { ThemeManager } from './theme.js';
import { AnimationManager } from './animations.js';
import { ThreeScene } from './three-scene.js';
import { TerminalHUD } from './terminal.js';
import { StatusHUD } from './status-hud.js';
import { AIChatbot } from './ai-chatbot.js';
import * as utils from './utils.js';

class PortfolioApp {
    constructor() {
        window.portfolioApp = this;
        this.isLoaded = false;
        this.isMobile = window.innerWidth <= 768;
        this.scrollProgress = 0;
        
        try {
            this.themeManager = new ThemeManager();
        } catch (e) {
            console.error('ThemeManager init error:', e);
        }
        
        try {
            this.threeScene = new ThreeScene('three-container', this);
        } catch (e) {
            console.error('ThreeScene init error:', e);
            this.threeScene = null;
        }
        
        try {
            this.animationManager = new AnimationManager(this);
        } catch (e) {
            console.error('AnimationManager init error:', e);
            this.animationManager = null;
        }
        
        try {
            this.terminalHUD = new TerminalHUD(this);
        } catch (e) {
            console.error('TerminalHUD init error:', e);
        }
        
        try {
            this.statusHUD = new StatusHUD(this);
        } catch (e) {
            console.error('StatusHUD init error:', e);
        }
        
        try {
            this.aiChatbot = new AIChatbot(this);
        } catch (e) {
            console.error('AIChatbot init error:', e);
        }
        
        this.init();
    }

    init() {
        this.initLenis();
        this.initGSAP();
        this.setupEventListeners();
        this.initPreloader();
        if (!this.isMobile) {
            this.initCustomCursor();
        }
        utils.setupPerformanceOptimizations();
    }

    initLenis() {
        this.lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        const raf = (time) => {
            this.lenis.raf(time);
            requestAnimationFrame(raf);
        };

        requestAnimationFrame(raf);

        this.lenis.on('scroll', (e) => {
            this.handleScroll(e);
        });
    }

    initGSAP() {
        gsap.registerPlugin(ScrollTrigger);
        this.lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            this.lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        window.addEventListener('load', () => {
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 1000);
        });
    }

    initCustomCursor() {
        const cursor = document.querySelector('.cursor');
        const follower = document.querySelector('.cursor-follower');
        
        if (!cursor || !follower) return;
        
        window.addEventListener('mousemove', (e) => {
            gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1, ease: 'none' });
            gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.3, ease: 'power2.out' });
        });
        
        const interactive = document.querySelectorAll('a, button, .clickable, .project-card, .skill-card-modern, .nav-link');
        interactive.forEach(el => {
            el.addEventListener('mouseenter', () => {
                gsap.to(follower, {
                    scale: 1.8,
                    backgroundColor: 'rgba(0, 180, 216, 0.15)',
                    borderColor: 'rgba(0, 180, 216, 0.8)',
                    duration: 0.3
                });
            });
            el.addEventListener('mouseleave', () => {
                gsap.to(follower, {
                    scale: 1,
                    backgroundColor: 'transparent',
                    borderColor: 'var(--primary-light)',
                    duration: 0.3
                });
            });
        });
    }

    setupEventListeners() {
        const initDOM = () => {
            this.isLoaded = true;
            utils.initTypewriter('.typewriter', ['IoT & Robotics Engineer', 'Software Developer', 'AI/ML Enthusiast', 'Django Developer']);
            this.initSkillsAnimation();
            this.initProjectFilters();
            this.initContactForm();
            this.initBackToTop();
            this.initTestimonials();
            this.initProjectDemos();
            utils.initKonamiCode(() => {
                document.body.style.animation = 'rainbow 2s ease-in-out';
                alert('🎉 SS-Tier Mode Activated!');
            });
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initDOM);
        } else {
            initDOM();
        }

        window.addEventListener('load', () => {
            setTimeout(() => this.hidePreloader(), 800);
        });
    }

    initPreloader() {
        const loadingText = document.querySelector('.loading-text');
        if (loadingText) {
            const lines = ['INITIALIZING CORE...', 'LOADING 3D ENGINE...', 'SYNCHRONIZING HUD...', 'SYSTEM READY.'];
            let currentLine = 0;
            const cycleText = setInterval(() => {
                loadingText.textContent = lines[currentLine];
                currentLine++;
                if (currentLine >= lines.length) clearInterval(cycleText);
            }, 400);
        }
    }

    hidePreloader() {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            gsap.to(preloader, {
                opacity: 0,
                visibility: 'hidden',
                duration: 1,
                ease: 'power4.inOut',
                onComplete: () => {
                    if (this.animationManager) {
                        this.animationManager.init();
                    }
                }
            });
        }
    }

    handleScroll(e) {
        const scrollTop = e ? e.scroll : (window.pageYOffset || document.documentElement.scrollTop);
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        this.scrollProgress = scrollTop / (documentHeight - windowHeight);
        
        if (this.statusHUD) {
            this.statusHUD.updateScroll(this.scrollProgress);
        }

        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.style.width = (this.scrollProgress * 100) + '%';
        }
        
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (scrollTop > 100) navbar.classList.add('scrolled');
            else navbar.classList.remove('scrolled');
        }
        
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            if (scrollTop > 500) backToTop.classList.add('show');
            else backToTop.classList.remove('show');
        }
    }

    initSkillsAnimation() {
        const skillCards = document.querySelectorAll('.skill-card-modern');
        const skillNavButtons = document.querySelectorAll('.skills-nav-btn');
        
        skillNavButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.getAttribute('data-category');
                skillNavButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                skillCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    if (category === 'all' || cardCategory === category) {
                        gsap.to(card, { opacity: 1, scale: 1, display: 'block', duration: 0.3 });
                    } else {
                        gsap.to(card, { opacity: 0, scale: 0.8, display: 'none', duration: 0.3 });
                    }
                });
            });
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const fill = entry.target.querySelector('.skill-fill');
                    if (fill) fill.style.width = fill.dataset.width + '%';
                }
            });
        }, { threshold: 0.1 });
        skillCards.forEach(card => observer.observe(card));
    }

    initProjectFilters() {
        const btns = document.querySelectorAll('.filter-btn');
        const items = document.querySelectorAll('.project-card');
        
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                btns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;
                
                items.forEach(item => {
                    const cat = item.dataset.category;
                    if (filter === 'all' || (cat && cat.includes(filter))) {
                        gsap.to(item, { opacity: 1, scale: 1, display: 'block', duration: 0.4 });
                    } else {
                        gsap.to(item, { opacity: 0, scale: 0.9, display: 'none', duration: 0.4 });
                    }
                });
            });
        });
    }

    initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            btn.disabled = true;
            
            try {
                const formData = new FormData(form);
                await fetch('https://docs.google.com/forms/u/0/d/e/1FAIpQLScCWsiYcXmyevTx-D5Yy-9OqlloIaekXR1v_35TwPtFs9jo0w/formResponse', {
                    method: 'POST', mode: 'no-cors', body: formData
                });
                
                gsap.to(form, { opacity: 0, y: -20, duration: 0.5, onComplete: () => {
                    form.style.display = 'none';
                    const success = document.getElementById('successMessage');
                    if (success) {
                        success.style.display = 'block';
                        gsap.from(success, { opacity: 0, y: 20, duration: 0.5 });
                    }
                }});
            } catch (error) {
                btn.innerHTML = 'Error. Try Again';
                btn.disabled = false;
            }
        });
    }

    initBackToTop() {
        const btn = document.getElementById('backToTop');
        if (btn) btn.addEventListener('click', () => this.lenis.scrollTo(0, { duration: 1.5 }));
    }

    initTestimonials() {
        this.currTestIdx = 0;
        const cards = document.querySelectorAll('.testimonial-card');
        const dots = document.querySelectorAll('.nav-dots .dot');
        if (cards.length === 0) return;

        const show = (idx) => {
            cards.forEach(c => c.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));
            cards[idx].classList.add('active');
            dots[idx].classList.add('active');
            this.currTestIdx = idx;
        };

        this.nextTestimonial = () => show((this.currTestIdx + 1) % cards.length);
        this.previousTestimonial = () => show(this.currTestIdx === 0 ? cards.length - 1 : this.currTestIdx - 1);
        this.currentTestimonial = (idx) => show(idx);

        setInterval(() => this.nextTestimonial(), 5000);
    }

    initProjectDemos() {
        const links = document.querySelectorAll('.demo-link');
        links.forEach(l => l.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Interactive Project Demos coming soon to the OS dashboard!');
        }));
    }
}

// Initialize App
window.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

console.log('%c INITIALIZING MODULAR SS-TIER SYSTEM v1.1.0 ', 'background: #0077b6; color: #fff; font-weight: bold; padding: 5px; border-radius: 3px;');
