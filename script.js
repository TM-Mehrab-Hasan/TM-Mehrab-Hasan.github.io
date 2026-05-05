/**
 * T. M. Mehrab Hasan - SS-Tier Portfolio Controller
 * Optimized with Lenis, GSAP, and Three.js
 */

class PortfolioApp {
    constructor() {
        this.isLoaded = false;
        this.isMobile = window.innerWidth <= 768;
        this.scrollProgress = 0;
        this.cursor = null;
        this.cursorFollower = null;
        this.threeScene = null;
        this.lenis = null;
        
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
        this.initThreeJS();
        this.setupPerformanceOptimizations();
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
        
        // Link ScrollTrigger to Lenis
        this.lenis.on('scroll', ScrollTrigger.update);
        
        gsap.ticker.add((time) => {
            this.lenis.raf(time * 1000);
        });
        
        gsap.ticker.lagSmoothing(0);
    }

    initCustomCursor() {
        if (this.isMobile) return;
        
        this.cursor = document.querySelector('.cursor');
        this.cursorFollower = document.querySelector('.cursor-follower');
        
        if (!this.cursor || !this.cursorFollower) return;
        
        window.addEventListener('mousemove', (e) => {
            gsap.to(this.cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: 'none'
            });
            
            gsap.to(this.cursorFollower, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        // Add hover effects for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .clickable, .project-card, .skill-card-modern, .nav-link');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                gsap.to(this.cursorFollower, {
                    scale: 1.8,
                    backgroundColor: 'rgba(0, 180, 216, 0.15)',
                    borderColor: 'rgba(0, 180, 216, 0.8)',
                    duration: 0.3
                });
            });
            
            el.addEventListener('mouseleave', () => {
                gsap.to(this.cursorFollower, {
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
            this.initTypewriter();
            this.initSkillsAnimation();
            this.initProjectFilters();
            this.initContactForm();
            this.initBackToTop();
            this.initThemeToggle();
            this.initBlogInteractions();
            this.initKonamiCode();
            this.initTestimonials();
            this.initProjectDemos();
            // Entrance animations will trigger after preloader hides
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initDOM);
        } else {
            initDOM();
        }

        window.addEventListener('load', () => {
            setTimeout(() => this.hidePreloader(), 800);
        });

        window.addEventListener('resize', () => {
            this.handleResize();
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
                    this.initAnimations();
                }
            });
        }
    }

    handleScroll(e) {
        const scrollTop = e ? e.scroll : (window.pageYOffset || document.documentElement.scrollTop);
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        this.scrollProgress = scrollTop / (documentHeight - windowHeight);
        
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.style.width = (this.scrollProgress * 100) + '%';
        }
        
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (scrollTop > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            if (scrollTop > 500) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        }
    }

    initThreeJS() {
        if (this.isMobile || typeof THREE === 'undefined') {
            console.log('Skipping Three.js: Mobile or Library not loaded');
            return;
        }

        const container = document.getElementById('three-container');
        if (!container) return;

        try {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            container.appendChild(renderer.domElement);

            camera.position.z = 5;

            // Particle Network
            const particlesCount = 100;
            const positions = new Float32Array(particlesCount * 3);
            const velocities = [];
            
            for(let i = 0; i < particlesCount; i++) {
                positions[i * 3] = (Math.random() - 0.5) * 10;
                positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
                
                velocities.push({
                    x: (Math.random() - 0.5) * 0.005,
                    y: (Math.random() - 0.5) * 0.005,
                    z: (Math.random() - 0.5) * 0.005
                });
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

            const material = new THREE.PointsMaterial({
                size: 0.05,
                color: 0x00b4d8,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending
            });

            const points = new THREE.Points(geometry, material);
            scene.add(points);

            const linesGeometry = new THREE.BufferGeometry();
            const linesMaterial = new THREE.LineBasicMaterial({
                color: 0x0077b6,
                transparent: true,
                opacity: 0.15,
                blending: THREE.AdditiveBlending
            });
            const lines = new THREE.LineSegments(linesGeometry, linesMaterial);
            scene.add(lines);

            let mouseX = 0, mouseY = 0;
            document.addEventListener('mousemove', (e) => {
                mouseX = (e.clientX / window.innerWidth) * 2 - 1;
                mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
            });

            const animate = () => {
                requestAnimationFrame(animate);

                const posAttr = geometry.attributes.position;
                const linePositions = [];

                for(let i = 0; i < particlesCount; i++) {
                    posAttr.array[i * 3] += velocities[i].x;
                    posAttr.array[i * 3 + 1] += velocities[i].y;
                    posAttr.array[i * 3 + 2] += velocities[i].z;

                    if(Math.abs(posAttr.array[i * 3]) > 6) velocities[i].x *= -1;
                    if(Math.abs(posAttr.array[i * 3 + 1]) > 6) velocities[i].y *= -1;
                    if(Math.abs(posAttr.array[i * 3 + 2]) > 6) velocities[i].z *= -1;

                    for(let j = i + 1; j < particlesCount; j++) {
                        const dx = posAttr.array[i * 3] - posAttr.array[j * 3];
                        const dy = posAttr.array[i * 3 + 1] - posAttr.array[j * 3 + 1];
                        const dz = posAttr.array[i * 3 + 2] - posAttr.array[j * 3 + 2];
                        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

                        if(dist < 2.5) {
                            linePositions.push(
                                posAttr.array[i * 3], posAttr.array[i * 3 + 1], posAttr.array[i * 3 + 2],
                                posAttr.array[j * 3], posAttr.array[j * 3 + 1], posAttr.array[j * 3 + 2]
                            );
                        }
                    }
                }

                posAttr.needsUpdate = true;
                linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

                camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.02;
                camera.position.y += (mouseY * 1.5 - camera.position.y) * 0.02;
                camera.lookAt(scene.position);

                renderer.render(scene, camera);
            };

            animate();
            this.threeScene = { scene, camera, renderer, points, lines };

        } catch (error) {
            console.error('Three.js Init Error:', error);
        }
    }

    initAnimations() {
        const sections = document.querySelectorAll('.section');
        
        sections.forEach(section => {
            const heading = section.querySelector('.section-header');
            const cards = section.querySelectorAll('.experience-card, .skill-card-modern, .project-card, .publication-card, .achievement-card, .activity-content');
            
            if (heading) {
                gsap.from(heading, {
                    scrollTrigger: {
                        trigger: heading,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    },
                    y: 60,
                    opacity: 0,
                    duration: 1.2,
                    ease: 'power4.out'
                });
            }
            
            if (cards.length > 0) {
                gsap.from(cards, {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 75%',
                        toggleActions: 'play none none none'
                    },
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    stagger: 0.15,
                    ease: 'power3.out'
                });
            }
        });

        // Hero Content Stagger
        gsap.from('.hero-content > *', {
            y: 40,
            opacity: 0,
            duration: 1.2,
            stagger: 0.2,
            ease: 'power4.out',
            delay: 0.5
        });

        // 3D Scene Rotation Tie
        if (this.threeScene) {
            gsap.to(this.threeScene.points.rotation, {
                scrollTrigger: {
                    trigger: 'body',
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1
                },
                y: Math.PI * 2,
                x: Math.PI
            });
        }
    }

    initTypewriter() {
        const el = document.querySelector('.typewriter');
        if (!el) return;
        
        const roles = ['IoT & Robotics Engineer', 'Software Developer', 'AI/ML Enthusiast', 'Django Developer'];
        let roleIdx = 0, charIdx = 0, isDel = false;
        
        const type = () => {
            const curr = roles[roleIdx];
            el.textContent = isDel ? curr.substring(0, charIdx--) : curr.substring(0, charIdx++);
            
            if (!isDel && charIdx > curr.length) { isDel = true; setTimeout(type, 2000); }
            else if (isDel && charIdx < 0) { isDel = false; roleIdx = (roleIdx + 1) % roles.length; setTimeout(type, 500); }
            else { setTimeout(type, isDel ? 50 : 100); }
        };
        type();
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

        // Skill bar fills
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
                // Simulate form submission to Google Forms (no-cors mode)
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

    initThemeToggle() {
        const btn = document.getElementById('themeToggle');
        if (!btn) return;
        
        const setTheme = (t) => {
            document.documentElement.setAttribute('data-theme', t);
            localStorage.setItem('portfolio-theme', t);
        };
        
        const saved = localStorage.getItem('portfolio-theme');
        if (saved) setTheme(saved);

        btn.addEventListener('click', () => {
            const curr = document.documentElement.getAttribute('data-theme');
            setTheme(curr === 'dark' ? 'light' : 'dark');
        });
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

        window.portfolioApp.nextTestimonial = () => show((this.currTestIdx + 1) % cards.length);
        window.portfolioApp.previousTestimonial = () => show(this.currTestIdx === 0 ? cards.length - 1 : this.currTestIdx - 1);
        window.portfolioApp.currentTestimonial = (idx) => show(idx);

        setInterval(() => window.portfolioApp.nextTestimonial(), 5000);
    }

    initKonamiCode() {
        const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
        let input = [];
        document.addEventListener('keydown', (e) => {
            input.push(e.code);
            if (input.length > code.length) input.shift();
            if (input.join(',') === code.join(',')) {
                document.body.style.animation = 'rainbow 2s ease-in-out';
                alert('🎉 SS-Tier Mode Activated!');
            }
        });
    }

    initProjectDemos() {
        const links = document.querySelectorAll('.demo-link');
        links.forEach(l => l.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Interactive Project Demos coming soon to the OS dashboard!');
        }));
    }

    initBlogInteractions() { /* Placeholder */ }

    setupPerformanceOptimizations() {
        // Image lazy loading
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting && e.target.dataset.src) {
                    e.target.src = e.target.dataset.src;
                    observer.unobserve(e.target);
                }
            });
        });
        document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
    }

    handleResize() {
        this.isMobile = window.innerWidth <= 768;
        if (this.threeScene && !this.isMobile) {
            const { camera, renderer } = this.threeScene;
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }
}

// Initialize App
window.addEventListener('DOMContentLoaded', () => {
    window.portfolioApp = new PortfolioApp();
});

console.log('%c INITIALIZING SS-TIER SYSTEM ', 'background: #0077b6; color: #fff; font-weight: bold; padding: 5px; border-radius: 3px;');
