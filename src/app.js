import { ThreeScene } from './three-scene.js';
import { Animations } from './animations.js';
import { AIChatbot } from './ai-chatbot.js';
import { StatusHUD } from './status-hud.js';
import { ThemeManager } from './theme.js';
import * as utils from './utils.js';

class App {
    constructor() {
        this.init();
    }

    async init() {
        // Initialize Core Components
        this.threeScene = new ThreeScene();
        this.animations = new Animations(this);
        this.chatbot = new AIChatbot(this);
        this.statusHUD = new StatusHUD(this);
        this.themeManager = new ThemeManager();

        // Setup smooth scrolling
        this.initLenis();

        // Global utilities
        utils.setupContactForm();
        utils.setupPerformanceOptimizations();
        utils.setupScrollSpy();

        // Hide preloader
        window.addEventListener('load', () => {
            const preloader = document.querySelector('.preloader');
            if (preloader) {
                preloader.classList.add('hidden');
                // Refresh ScrollTrigger after elements are visible
                setTimeout(() => {
                    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
                }, 500);
            }
        });
    }

    initLenis() {
        if (typeof Lenis === 'undefined') return;

        this.lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smoothWheel: true,
            smoothTouch: false, // Disabled on touch for better native feel/perf
            touchMultiplier: 2,
        });

        // Use GSAP ticker for Lenis for unified RAF
        if (window.gsap) {
            window.gsap.ticker.add((time) => {
                this.lenis.raf(time * 1000);
            });
            window.gsap.ticker.lagSmoothing(0);
        } else {
            // Fallback to native RAF if GSAP is missing
            const raf = (time) => {
                this.lenis.raf(time);
                requestAnimationFrame(raf);
            };
            requestAnimationFrame(raf);
        }

        // Sync ScrollTrigger with Lenis
        this.lenis.on('scroll', () => {
            if (window.ScrollTrigger) window.ScrollTrigger.update();
        });
    }
}

// Start Application
new App();