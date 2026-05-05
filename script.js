// Enhanced Portfolio JavaScript with Modern Features
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
        this.initScrollEffects();
        this.initThreeJS();
        this.initInteractiveElements();
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
        
        // Add hover effects for links
        const interactiveElements = document.querySelectorAll('a, button, .clickable, .project-card, .skill-card-modern');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                gsap.to(this.cursorFollower, {
                    scale: 1.5,
                    backgroundColor: 'rgba(0, 180, 216, 0.1)',
                    duration: 0.3
                });
            });
            
            el.addEventListener('mouseleave', () => {
                gsap.to(this.cursorFollower, {
                    scale: 1,
                    backgroundColor: 'transparent',
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
            this.initAnimations();
            this.initEasterEggs();
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initDOM);
        } else {
            initDOM();
        }

        window.addEventListener('load', () => {
            setTimeout(() => this.hidePreloader(), 500);
        });

        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    initPreloader() {
        // Technical "System Booting" text animation
        const loadingText = document.querySelector('.loading-text');
        if (loadingText) {
            const lines = ['Initializing Core...', 'Loading 3D Engine...', 'Synchronizing HUD...', 'Ready.'];
            let currentLine = 0;
            
            const cycleText = setInterval(() => {
                loadingText.textContent = lines[currentLine];
                currentLine++;
                if (currentLine >= lines.length) clearInterval(cycleText);
            }, 500);
        }
    }

    hidePreloader() {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            gsap.to(preloader, {
                opacity: 0,
                visibility: 'hidden',
                duration: 1,
                ease: 'power2.inOut',
                onComplete: () => {
                    // Trigger entrance animations
                    this.initAnimations();
                }
            });
        }
    }

    initScrollEffects() {
        // This is handled by Lenis + GSAP ScrollTrigger
    }

    throttledScroll() {
        // Redundant with Lenis, but kept for compatibility if needed
        this.handleScroll();
    }

    handleScroll(e) {
        const scrollTop = e ? e.scroll : (window.pageYOffset || document.documentElement.scrollTop);
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Update scroll progress
        this.scrollProgress = scrollTop / (documentHeight - windowHeight);
        
        // Update scroll indicator
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.style.width = (this.scrollProgress * 100) + '%';
        }
        
        // Navbar scrolled state
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (scrollTop > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        // Show/hide back to top button
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            if (scrollTop > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        }
    }

    updateParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + window.scrollY;
            const elementHeight = rect.height;
            const windowHeight = window.innerHeight;
            
            const elementCenter = elementTop + elementHeight / 2;
            const scrollCenter = window.scrollY + windowHeight / 2;
            
            if (elementTop < window.scrollY + windowHeight && elementTop + elementHeight > window.scrollY) {
                const yPos = (scrollCenter - elementCenter) * speed;
                element.style.transform = `translateY(${yPos}px)`;
            }
        });
    }

    // Three.js 3D Background
        // Three.js 3D Background
    initThreeJS() {
        if (this.isMobile) return;

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

            // Particles
            const particlesCount = 100; // Optimized for performance with connections
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

            // Lines for connections
            const linesGeometry = new THREE.BufferGeometry();
            const linesMaterial = new THREE.LineBasicMaterial({
                color: 0x0077b6,
                transparent: true,
                opacity: 0.15,
                blending: THREE.AdditiveBlending
            });
            const lines = new THREE.LineSegments(linesGeometry, linesMaterial);
            scene.add(lines);

            // Mouse tracking for interaction
            let mouseX = 0, mouseY = 0;
            document.addEventListener('mousemove', (e) => {
                mouseX = (e.clientX / window.innerWidth) * 2 - 1;
                mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
            });

            // Animation loop
            const animate = () => {
                requestAnimationFrame(animate);

                const posAttr = geometry.attributes.position;
                const linePositions = [];

                for(let i = 0; i < particlesCount; i++) {
                    posAttr.array[i * 3] += velocities[i].x;
                    posAttr.array[i * 3 + 1] += velocities[i].y;
                    posAttr.array[i * 3 + 2] += velocities[i].z;

                    // Bounds check
                    if(Math.abs(posAttr.array[i * 3]) > 6) velocities[i].x *= -1;
                    if(Math.abs(posAttr.array[i * 3 + 1]) > 6) velocities[i].y *= -1;
                    if(Math.abs(posAttr.array[i * 3 + 2]) > 6) velocities[i].z *= -1;

                    // Connections logic
                    for(let j = i + 1; j < particlesCount; j++) {
                        const dx = posAttr.array[i * 3] - posAttr.array[j * 3];
                        const dy = posAttr.array[i * 3 + 1] - posAttr.array[j * 3 + 1];
                        const dz = posAttr.array[i * 3 + 2] - posAttr.array[j * 3 + 2];
                        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

                        if(dist < 2.2) {
                            linePositions.push(
                                posAttr.array[i * 3], posAttr.array[i * 3 + 1], posAttr.array[i * 3 + 2],
                                posAttr.array[j * 3], posAttr.array[j * 3 + 1], posAttr.array[j * 3 + 2]
                            );
                        }
                    }
                }

                posAttr.needsUpdate = true;
                linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

                // Camera parallax
                camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.02;
                camera.position.y += (mouseY * 1.5 - camera.position.y) * 0.02;
                camera.lookAt(scene.position);

                renderer.render(scene, camera);
            };

            animate();

            // Resize handling
            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });

            this.threeScene = { scene, camera, renderer, points, lines };

        } catch (error) {
            console.error('Three.js initialization failed:', error);
        }
    }

        // Animations
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

        // Tie Three.js scene to scroll
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

            gsap.to(this.threeScene.lines.rotation, {
                scrollTrigger: {
                    trigger: 'body',
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1.5
                },
                y: -Math.PI * 2,
                x: -Math.PI
            });
        }

        // Stagger nav links on load
        gsap.from('.nav-link', {
            y: -20,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            delay: 1.2
        });

        // Specialized animations for hero
        gsap.from('.hero-content > *', {
            y: 40,
            opacity: 0,
            duration: 1.2,
            stagger: 0.2,
            ease: 'power4.out',
            delay: 0.8
        });
        
        // Animated background gradient movement
        gsap.to('.hero-gradient', {
            scale: 1.2,
            duration: 10,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }

    // Typewriter Effect
    initTypewriter() {
        const typewriterElement = document.querySelector('.typewriter');
        if (!typewriterElement) return;
        
        const roles = [
            'IoT & Robotics Engineer',
            'Software Developer',
            'AI/ML Enthusiast', 
            'Django Backend Developer',
            'Embedded Systems Engineer',
            'Tech Innovator'
        ];
        
        let currentRoleIndex = 0;
        let currentCharIndex = 0;
        let isDeleting = false;
        
        const type = () => {
            const currentRole = roles[currentRoleIndex];
            
            if (isDeleting) {
                typewriterElement.textContent = currentRole.substring(0, currentCharIndex - 1);
                currentCharIndex--;
            } else {
                typewriterElement.textContent = currentRole.substring(0, currentCharIndex + 1);
                currentCharIndex++;
            }
            
            let typeSpeedCurrent = isDeleting ? 50 : 100;
            
            if (!isDeleting && currentCharIndex === currentRole.length) {
                typeSpeedCurrent = 2000;
                isDeleting = true;
            } else if (isDeleting && currentCharIndex === 0) {
                isDeleting = false;
                currentRoleIndex = (currentRoleIndex + 1) % roles.length;
            }
            
            setTimeout(type, typeSpeedCurrent);
        };
        
        setTimeout(type, 1000);
    }

    // Skills Animation & Interaction
    initSkillsAnimation() {
        const skillCards = document.querySelectorAll('.skill-card-modern');
        const skillNavButtons = document.querySelectorAll('.skills-nav-btn');
        
        // Animate skill bars when they come into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillCard = entry.target;
                    const progressBar = skillCard.querySelector('.skill-fill');
                    
                    if (progressBar) {
                        const targetWidth = progressBar.getAttribute('data-width');
                        setTimeout(() => {
                            progressBar.style.width = targetWidth + '%';
                        }, 200);
                    }
                }
            });
        }, { threshold: 0.1 });
        
        skillCards.forEach(card => observer.observe(card));
        
        // Skills category filtering
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
    }

    // Project Filters
    initProjectFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectItems = document.querySelectorAll('.project-card');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filterValue = button.getAttribute('data-filter');
                
                projectItems.forEach(item => {
                    const categories = item.getAttribute('data-category');
                    if (filterValue === 'all' || (categories && categories.includes(filterValue))) {
                        gsap.to(item, { opacity: 1, scale: 1, display: 'block', duration: 0.4 });
                    } else {
                        gsap.to(item, { opacity: 0, scale: 0.9, display: 'none', duration: 0.4 });
                    }
                });
            });
        });
    }

    // Contact Form
    initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
            submitButton.disabled = true;
            
            try {
                // Mock submission for demo
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                gsap.to(form, { opacity: 0, y: -20, duration: 0.5, onComplete: () => {
                    form.style.display = 'none';
                    const success = document.getElementById('successMessage');
                    if (success) {
                        success.style.display = 'block';
                        gsap.from(success, { opacity: 0, y: 20, duration: 0.5 });
                    }
                }});
            } catch (error) {
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }
        });
    }

    // Interactive Elements
    initInteractiveElements() {
        // Smooth scrolling for navigation links using Lenis
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const target = document.querySelector(targetId);
                if (target) {
                    this.lenis.scrollTo(target, {
                        offset: -80,
                        duration: 1.5,
                        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                    });
                    history.pushState(null, null, targetId);
                }
            });
        });

        // Magnetic Buttons
        const magneticButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .nav-link, .social-links a');
        magneticButtons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                gsap.to(btn, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });

        // Project card hover effects
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (!this.isMobile) {
                    gsap.to(card, {
                        y: -10,
                        rotateX: 5,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });
            
            card.addEventListener('mouseleave', () => {
                if (!this.isMobile) {
                    gsap.to(card, {
                        y: 0,
                        rotateX: 0,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });
        });

        // Skill card animations
        const skillCards = document.querySelectorAll('.skill-card-modern');
        skillCards.forEach((card, index) => {
            card.addEventListener('mouseenter', () => {
                if (!this.isMobile) {
                    gsap.to(card, {
                        y: -5,
                        scale: 1.02,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });
            
            card.addEventListener('mouseleave', () => {
                if (!this.isMobile) {
                    gsap.to(card, {
                        y: 0,
                        scale: 1,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });
        });
    }

    // Back to Top Button
    initBackToTop() {
        const backToTop = document.getElementById('backToTop');
        if (!backToTop) return;
        
        backToTop.addEventListener('click', () => {
            this.lenis.scrollTo(0, {
                duration: 1.5,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
        });
    }

    // Performance Optimizations
    setupPerformanceOptimizations() {
        // Lazy load images
        this.initLazyLoading();
    }

    initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;
        
        // Toggle mobile optimizations
        if (wasMobile !== this.isMobile) {
            if (this.isMobile) {
                this.enableMobileOptimizations();
            } else {
                this.disableMobileOptimizations();
            }
        }
        
        // Update Three.js if needed
        if (this.threeScene && !this.isMobile) {
            const { camera, renderer } = this.threeScene;
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }

    // Utility Methods
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    // Easter Eggs and Fun Features
    initEasterEggs() {
        // Konami Code
        let konamiCode = [];
        const correctCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
        
        document.addEventListener('keydown', (e) => {
            konamiCode.push(e.keyCode);
            
            if (konamiCode.length > correctCode.length) {
                konamiCode.shift();
            }
            
            if (JSON.stringify(konamiCode) === JSON.stringify(correctCode)) {
                this.activateRainbowMode();
            }
        });

        // Double-click logo for surprise
        const logo = document.querySelector('.brand-logo');
        if (logo) {
            let clickCount = 0;
            logo.addEventListener('click', () => {
                clickCount++;
                if (clickCount === 3) {
                    this.activatePartyMode();
                    clickCount = 0;
                }
                setTimeout(() => clickCount = 0, 1000);
            });
        }
    }

    activateRainbowMode() {
        document.body.style.animation = 'rainbow 3s linear infinite';
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 10000);
        
        // Add rainbow keyframes if not exists
        if (!document.querySelector('#rainbow-keyframes')) {
            const style = document.createElement('style');
            style.id = 'rainbow-keyframes';
            style.textContent = `
                @keyframes rainbow {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    activatePartyMode() {
        // Create confetti effect
        this.createConfetti();
        
        // Flash colors
        document.body.style.animation = 'party-flash 0.5s infinite';
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
        
        if (!document.querySelector('#party-keyframes')) {
            const style = document.createElement('style');
            style.id = 'party-keyframes';
            style.textContent = `
                @keyframes party-flash {
                    0%, 100% { background-color: var(--bg-primary); }
                    25% { background-color: rgba(99, 102, 241, 0.1); }
                    50% { background-color: rgba(139, 92, 246, 0.1); }
                    75% { background-color: rgba(6, 214, 160, 0.1); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    createConfetti() {
        const colors = ['#6366f1', '#8b5cf6', '#06d6a0', '#f59e0b', '#ef4444'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                top: -10px;
                left: ${Math.random() * 100}%;
                transform: rotate(${Math.random() * 360}deg);
                animation: confetti-fall 3s linear forwards;
                z-index: 10000;
                pointer-events: none;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }
        
        if (!document.querySelector('#confetti-keyframes')) {
            const style = document.createElement('style');
            style.id = 'confetti-keyframes';
            style.textContent = `
                @keyframes confetti-fall {
                    to {
                        transform: translateY(100vh) rotate(720deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Theme Toggle
    initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

        // Use saved preference, otherwise follow system theme
        const savedTheme = localStorage.getItem('portfolio-theme');
        const initialTheme = savedTheme || (systemPrefersDark.matches ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', initialTheme);

        // Listen for system theme changes (only applies if user hasn't manually set a preference)
        systemPrefersDark.addEventListener('change', (e) => {
            if (!localStorage.getItem('portfolio-theme')) {
                const systemTheme = e.matches ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', systemTheme);
                this.updateThreeJSColors(systemTheme);
            }
        });

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('portfolio-theme', newTheme);
            
            // Update Three.js scene colors if it exists
            this.updateThreeJSColors(newTheme);
            
            // Add a nice transition effect
            themeToggle.style.transform = 'scale(0.8)';
            setTimeout(() => {
                themeToggle.style.transform = 'scale(1)';
            }, 150);
        });
    }

    updateThreeJSColors(theme) {
        if (!this.threeScene) return;
        
        // Update particle colors based on theme
        const isDark = theme === 'dark';
        const particleColor = isDark ? 0x6366f1 : 0x3b82f6;
        
        // This would be implemented based on your Three.js setup
        // For now, just a placeholder for the functionality
    }

    // Blog Interactions
    initBlogInteractions() {
        const blogCards = document.querySelectorAll('.blog-card');
        
        blogCards.forEach(card => {
            // Add interactive card class
            card.classList.add('interactive-card');
            
            // Add click animation
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.read-more')) {
                    const readMoreLink = card.querySelector('.read-more');
                    if (readMoreLink) {
                        // Add ripple effect
                        this.createRipple(card, e);
                        
                        // Simulate click on read more
                        setTimeout(() => {
                            readMoreLink.click();
                        }, 200);
                    }
                }
            });
            
            // Add floating animation to featured cards
            if (card.classList.contains('featured')) {
                card.classList.add('float-animation');
            }
        });
    }

    createRipple(element, event) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
        `;
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    // Easter Egg - Konami Code
    initKonamiCode() {
        const konamiCode = [
            'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
            'KeyB', 'KeyA'
        ];
        let userInput = [];

        document.addEventListener('keydown', (e) => {
            userInput.push(e.code);
            if (userInput.length > konamiCode.length) {
                userInput.shift();
            }

            if (userInput.join(',') === konamiCode.join(',')) {
                this.activateEasterEgg();
                userInput = [];
            }
        });
    }

    activateEasterEgg() {
        // Add rainbow colors to particles
        document.body.style.animation = 'rainbow-background 2s ease-in-out';
        
        // Show special message
        this.showNotification('🎉 Konami Code activated! You found the easter egg!', 'success');
        
        // Add special CSS for rainbow effect
        if (!document.getElementById('easter-egg-styles')) {
            const style = document.createElement('style');
            style.id = 'easter-egg-styles';
            style.textContent = `
                @keyframes rainbow-background {
                    0% { filter: hue-rotate(0deg); }
                    25% { filter: hue-rotate(90deg); }
                    50% { filter: hue-rotate(180deg); }
                    75% { filter: hue-rotate(270deg); }
                    100% { filter: hue-rotate(360deg); }
                }
                
                @keyframes ripple-animation {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 2000);
    }

    // Testimonials Carousel
    initTestimonials() {
        this.currentTestimonialIndex = 0;
        this.testimonialInterval = null;
        
        const testimonials = document.querySelectorAll('.testimonial-card');
        if (testimonials.length === 0) return;

        // Auto-rotate testimonials
        this.testimonialInterval = setInterval(() => {
            this.nextTestimonial();
        }, 5000);

        // Pause on hover
        const carousel = document.querySelector('.testimonials-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => {
                clearInterval(this.testimonialInterval);
            });

            carousel.addEventListener('mouseleave', () => {
                this.testimonialInterval = setInterval(() => {
                    this.nextTestimonial();
                }, 5000);
            });
        }
    }

    showTestimonial(index) {
        const testimonials = document.querySelectorAll('.testimonial-card');
        const dots = document.querySelectorAll('.nav-dots .dot');
        
        testimonials.forEach(testimonial => testimonial.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        if (testimonials[index] && dots[index]) {
            testimonials[index].classList.add('active');
            dots[index].classList.add('active');
        }
        
        this.currentTestimonialIndex = index;
    }

    nextTestimonial() {
        const testimonials = document.querySelectorAll('.testimonial-card');
        const nextIndex = (this.currentTestimonialIndex + 1) % testimonials.length;
        this.showTestimonial(nextIndex);
    }

    previousTestimonial() {
        const testimonials = document.querySelectorAll('.testimonial-card');
        const prevIndex = this.currentTestimonialIndex === 0 ? testimonials.length - 1 : this.currentTestimonialIndex - 1;
        this.showTestimonial(prevIndex);
    }

    currentTestimonial(index) {
        this.showTestimonial(index);
    }

    // Project Demos
    initProjectDemos() {
        const demoLinks = document.querySelectorAll('.demo-link');
        
        demoLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const demoType = link.dataset.demo;
                this.openProjectDemo(demoType);
            });
        });
    }

    openProjectDemo(demoType) {
        // Create modal if it doesn't exist
        let modal = document.getElementById('demo-modal');
        if (!modal) {
            modal = this.createDemoModal();
        }

        const demoContent = this.getDemoContent(demoType);
        modal.querySelector('.demo-video').innerHTML = demoContent;
        modal.classList.add('active');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    createDemoModal() {
        const modal = document.createElement('div');
        modal.id = 'demo-modal';
        modal.className = 'demo-modal';
        modal.innerHTML = `
            <div class="demo-content">
                <button class="demo-close" onclick="portfolioApp.closeDemoModal()">
                    <i class="fas fa-times"></i>
                </button>
                <div class="demo-video"></div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeDemoModal();
            }
        });
        
        return modal;
    }

    getDemoContent(demoType) {
        const demos = {
            'fire-robot': `
                <div style="text-align: center; padding: 2rem;">
                    <h3 style="color: var(--text-primary); margin-bottom: 1rem;">🔥 Fire Detection Robot Demo</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 2rem;">
                        This autonomous robot uses multiple sensors to detect fire and automatically deploy water sprinklers.
                        Featured at the 57th International Education Expo 2023.
                    </p>
                    <div style="background: var(--bg-primary); padding: 2rem; border-radius: 10px; margin-bottom: 1rem;">
                        <i class="fas fa-robot" style="font-size: 4rem; color: var(--primary-color);"></i>
                        <p style="margin-top: 1rem; color: var(--text-secondary);">Interactive demo coming soon!</p>
                    </div>
                    <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                        <span style="background: var(--bg-glass); padding: 0.5rem 1rem; border-radius: 20px; color: var(--text-secondary);">Arduino Uno</span>
                        <span style="background: var(--bg-glass); padding: 0.5rem 1rem; border-radius: 20px; color: var(--text-secondary);">Flame Sensors</span>
                        <span style="background: var(--bg-glass); padding: 0.5rem 1rem; border-radius: 20px; color: var(--text-secondary);">Water Pump</span>
                        <span style="background: var(--bg-glass); padding: 0.5rem 1rem; border-radius: 20px; color: var(--text-secondary);">Wireless Control</span>
                    </div>
                </div>
            `
        };
        
        return demos[demoType] || '<p>Demo content not available</p>';
    }

    closeDemoModal() {
        const modal = document.getElementById('demo-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    // Certificate Viewer
    viewCertificate(filePath) {
        // Check if it's a PDF
        const isPDF = filePath.toLowerCase().endsWith('.pdf');
        
        if (isPDF) {
            // Open PDF in a new tab for better viewing experience
            window.open(filePath, '_blank');
            return;
        }

        // Handle image certificates with modal
        let modal = document.getElementById('certificate-modal');
        if (!modal) {
            modal = this.createCertificateModal();
        }

        // Get certificate title from path
        const fileName = filePath.split('/').pop();
        const title = this.getCertificateTitle(fileName);
        
        // Update modal content
        modal.querySelector('.certificate-title').textContent = title;
        modal.querySelector('.certificate-image').src = filePath;
        modal.querySelector('.certificate-image').alt = title;
        
        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    createCertificateModal() {
        const modal = document.createElement('div');
        modal.id = 'certificate-modal';
        modal.className = 'certificate-modal';
        modal.innerHTML = `
            <div class="certificate-content">
                <button class="certificate-close" onclick="portfolioApp.closeCertificateModal()">
                    <i class="fas fa-times"></i>
                </button>
                <h3 class="certificate-title">Certificate</h3>
                <img class="certificate-image" src="" alt="Certificate" />
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeCertificateModal();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                this.closeCertificateModal();
            }
        });
        
        return modal;
    }

    getCertificateTitle(fileName) {
        const titles = {
            'Dean\'s List Award (Level-3).jpg': 'Dean\'s List Award - Level 3',
            '6. Team Matrix Certificate.jpg': 'Team Matrix Elite Hackers Certificate',
            '3. Soft Skill (Core Employability).jpg': '21st Century Employability Skills Certificate',
            '4. Creative IT Certificate.jpg': 'Creative IT Institute Certificate',
            '7. OPSWAT CIP Certificate.png': 'OPSWAT CIP Certificate',
            'CppBuzz.png': 'Python Programming Certificate',
            'Ratul Internship Certificate.png': 'Professional Internship Certificate',
            'RTV Oraganizing Team Member .png': 'RTV Organizing Team Member Certificate',
            '2. AWS Crtificate.pdf': 'AWS Cloud Computing Certificate',
            '5. Soft Skill Certificate.pdf': 'Wadhwani Foundation - 21st Century Employability Skills',
            '1. CPP Buzz Certificate.pdf': 'CPP Buzz - Python Programming Certificate'
        };
        
        return titles[fileName] || 'Certificate';
    }

    closeCertificateModal() {
        const modal = document.getElementById('certificate-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: var(--bg-glass);
            backdrop-filter: blur(10px);
            border: 1px solid var(--border-primary);
            border-radius: 10px;
            padding: 1rem 1.5rem;
            color: var(--text-primary);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize the enhanced portfolio app
const portfolioApp = new PortfolioApp();

// Console easter egg
console.log(`
    ╔═══════════════════════════════════════════════════════════════╗
    ║                                                               ║
    ║    ████████╗███╗   ███╗    ███╗   ███╗███████╗██╗  ██╗██████╗ ║
    ║    ╚══██╔══╝████╗ ████║    ████╗ ████║██╔════╝██║  ██║██╔══██╗║
    ║       ██║   ██╔████╔██║    ██╔████╔██║█████╗  ███████║██████╔╝║
    ║       ██║   ██║╚██╔╝██║    ██║╚██╔╝██║██╔══╝  ██╔══██║██╔══██╗║
    ║       ██║   ██║ ╚═╝ ██║    ██║ ╚═╝ ██║███████╗██║  ██║██║  ██║║
    ║       ╚═╝   ╚═╝     ╚═╝    ╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝║
    ║                                                               ║
    ║           Welcome to my enhanced portfolio! 🚀               ║
    ║           Built with modern web technologies                  ║
    ║           Try the Konami code for a surprise! 🎮             ║
    ║                                                               ║
    ╚═══════════════════════════════════════════════════════════════╝
`);

console.log('🎯 Enhanced Portfolio Features:');
console.log('• 3D Background with Three.js');
console.log('• Dark/Light Theme Toggle');
console.log('• Interactive Blog Section');
console.log('• Testimonials Carousel');
console.log('• Project Live Demos');
console.log('• Custom Cursor Effects');
console.log('• Smooth Animations & Transitions');
console.log('• Responsive Design');
console.log('• Performance Optimized');
console.log('• Easter Eggs Hidden! 🥚 (Try Konami Code!)');

// Make portfolioApp globally accessible for functionality
window.portfolioApp = portfolioApp;