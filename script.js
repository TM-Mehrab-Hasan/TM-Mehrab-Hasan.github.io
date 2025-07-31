// Enhanced Portfolio JavaScript with Modern Features
class PortfolioApp {
    constructor() {
        this.isLoaded = false;
        this.isMobile = window.innerWidth <= 768;
        this.scrollProgress = 0;
        this.cursor = null;
        this.cursorFollower = null;
        this.threeScene = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initPreloader();
        if (!this.isMobile) {
            this.initCustomCursor();
        }
        this.initScrollEffects();
        this.initAnimations();
        this.initThreeJS();
        this.initInteractiveElements();
        this.setupPerformanceOptimizations();
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.isLoaded = true;
            this.initAOS();
            this.initTypewriter();
            this.initSkillsAnimation();
            this.initProjectFilters();
            this.initContactForm();
            this.initBackToTop();
        });

        window.addEventListener('load', () => {
            this.hidePreloader();
        });

        window.addEventListener('resize', () => {
            this.handleResize();
        });

        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
    }

    // Preloader
    initPreloader() {
        const preloader = document.getElementById('preloader');
        if (!preloader) return;

        // Simulate loading progress
        let progress = 0;
        const progressBar = preloader.querySelector('.loading-progress');
        
        const loadingInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadingInterval);
            }
            if (progressBar) {
                progressBar.style.width = progress + '%';
            }
        }, 200);
    }

    hidePreloader() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            setTimeout(() => {
                preloader.classList.add('hidden');
                setTimeout(() => {
                    preloader.remove();
                }, 500);
            }, 1000);
        }
    }

    // Custom Cursor
    initCustomCursor() {
        this.cursor = document.querySelector('.cursor');
        this.cursorFollower = document.querySelector('.cursor-follower');
        
        if (!this.cursor || !this.cursorFollower) return;

        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            this.cursor.style.left = mouseX + 'px';
            this.cursor.style.top = mouseY + 'px';
        });

        // Smooth follower animation
        const animateFollower = () => {
            const speed = 0.2;
            followerX += (mouseX - followerX) * speed;
            followerY += (mouseY - followerY) * speed;
            
            this.cursorFollower.style.left = followerX + 'px';
            this.cursorFollower.style.top = followerY + 'px';
            
            requestAnimationFrame(animateFollower);
        };
        animateFollower();

        // Cursor hover effects
        const hoverElements = document.querySelectorAll(
            'a, button, .project-card, .skill-card, .filter-btn, .achievement-card, .contact-info-card'
        );
        
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.cursor.style.transform = 'scale(2)';
                this.cursorFollower.style.transform = 'scale(1.5)';
                this.cursorFollower.style.opacity = '0.8';
            });
            
            element.addEventListener('mouseleave', () => {
                this.cursor.style.transform = 'scale(1)';
                this.cursorFollower.style.transform = 'scale(1)';
                this.cursorFollower.style.opacity = '0.6';
            });
        });
    }

    // Scroll Effects
    initScrollEffects() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        const navbar = document.querySelector('.navbar');
        
        if (!scrollIndicator || !navbar) return;

        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            scrollIndicator.style.width = scrollPercent + '%';
            
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    handleScroll() {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        this.scrollProgress = scrollTop / (documentHeight - windowHeight);
        
        // Parallax effects
        this.updateParallax();
        
        // Update scroll indicator
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.style.width = (this.scrollProgress * 100) + '%';
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
    initThreeJS() {
        if (this.isMobile) return;
        
        const container = document.getElementById('three-container');
        if (!container) return;

        try {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0x000000, 0);
            container.appendChild(renderer.domElement);
            
            // Create particle system
            const particlesGeometry = new THREE.BufferGeometry();
            const particlesCount = 2000;
            const posArray = new Float32Array(particlesCount * 3);
            const colorArray = new Float32Array(particlesCount * 3);
            
            for (let i = 0; i < particlesCount * 3; i += 3) {
                posArray[i] = (Math.random() - 0.5) * 10;
                posArray[i + 1] = (Math.random() - 0.5) * 10;
                posArray[i + 2] = (Math.random() - 0.5) * 10;
                
                // Color variation
                const color = new THREE.Color();
                color.setHSL(Math.random() * 0.2 + 0.5, 0.7, 0.6);
                colorArray[i] = color.r;
                colorArray[i + 1] = color.g;
                colorArray[i + 2] = color.b;
            }
            
            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
            particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
            
            const particlesMaterial = new THREE.PointsMaterial({
                size: 0.01,
                vertexColors: true,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending
            });
            
            const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
            scene.add(particlesMesh);
            
            // Create floating geometric shapes
            const geometries = [
                new THREE.TetrahedronGeometry(0.1),
                new THREE.OctahedronGeometry(0.1),
                new THREE.IcosahedronGeometry(0.1),
                new THREE.TorusGeometry(0.08, 0.04, 8, 16)
            ];
            
            const shapes = [];
            for (let i = 0; i < 15; i++) {
                const geometry = geometries[Math.floor(Math.random() * geometries.length)];
                const material = new THREE.MeshBasicMaterial({
                    color: Math.random() > 0.5 ? 0x6366f1 : 0x8b5cf6,
                    wireframe: true,
                    transparent: true,
                    opacity: 0.4
                });
                
                const shape = new THREE.Mesh(geometry, material);
                shape.position.set(
                    (Math.random() - 0.5) * 15,
                    (Math.random() - 0.5) * 15,
                    (Math.random() - 0.5) * 15
                );
                
                shape.rotation.set(
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                    Math.random() * Math.PI
                );
                
                shape.userData = {
                    originalPosition: shape.position.clone(),
                    rotationSpeed: {
                        x: (Math.random() - 0.5) * 0.02,
                        y: (Math.random() - 0.5) * 0.02,
                        z: (Math.random() - 0.5) * 0.02
                    }
                };
                
                shapes.push(shape);
                scene.add(shape);
            }
            
            camera.position.z = 3;
            
            // Mouse interaction
            let mouseX = 0, mouseY = 0;
            document.addEventListener('mousemove', (e) => {
                mouseX = (e.clientX / window.innerWidth) * 2 - 1;
                mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
            });
            
            // Animation loop
            const animate = () => {
                requestAnimationFrame(animate);
                
                // Rotate particles
                particlesMesh.rotation.x += 0.0003;
                particlesMesh.rotation.y += 0.0005;
                
                // Animate shapes
                shapes.forEach((shape, index) => {
                    shape.rotation.x += shape.userData.rotationSpeed.x;
                    shape.rotation.y += shape.userData.rotationSpeed.y;
                    shape.rotation.z += shape.userData.rotationSpeed.z;
                    
                    // Floating animation
                    const time = Date.now() * 0.001;
                    shape.position.y = shape.userData.originalPosition.y + Math.sin(time + index) * 0.5;
                });
                
                // Mouse interaction
                camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
                camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
                camera.lookAt(scene.position);
                
                renderer.render(scene, camera);
            };
            
            animate();
            
            // Handle resize
            window.addEventListener('resize', () => {
                if (this.isMobile) return;
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });
            
            this.threeScene = { scene, camera, renderer, shapes, particlesMesh };
            
        } catch (error) {
            console.log('Three.js not available, skipping 3D effects');
        }
    }

    // Animations
    initAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, observerOptions);
        
        const elementsToAnimate = document.querySelectorAll(
            '.section, .about-content, .experience-card, .skill-card, .project-card, .achievement-card, .publication-card, .activity-content, .contact-form-container'
        );
        
        elementsToAnimate.forEach(el => observer.observe(el));
    }

    initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 100,
                delay: 0
            });
        }
    }

    // Typewriter Effect
    initTypewriter() {
        const typewriterElement = document.querySelector('.typewriter');
        if (!typewriterElement) return;
        
        const text = typewriterElement.textContent;
        const roles = [
            'IoT Engineer',
            'Robotics Engineer', 
            'Web Developer',
            'AI Enthusiast',
            'Tech Innovator'
        ];
        
        let currentRoleIndex = 0;
        let currentCharIndex = 0;
        let isDeleting = false;
        
        const typeSpeed = 100;
        const deleteSpeed = 50;
        const pauseTime = 2000;
        
        function type() {
            const currentRole = roles[currentRoleIndex];
            
            if (isDeleting) {
                typewriterElement.textContent = currentRole.substring(0, currentCharIndex - 1);
                currentCharIndex--;
            } else {
                typewriterElement.textContent = currentRole.substring(0, currentCharIndex + 1);
                currentCharIndex++;
            }
            
            let typeSpeedCurrent = isDeleting ? deleteSpeed : typeSpeed;
            
            if (!isDeleting && currentCharIndex === currentRole.length) {
                typeSpeedCurrent = pauseTime;
                isDeleting = true;
            } else if (isDeleting && currentCharIndex === 0) {
                isDeleting = false;
                currentRoleIndex = (currentRoleIndex + 1) % roles.length;
            }
            
            setTimeout(type, typeSpeedCurrent);
        }
        
        setTimeout(type, 1000);
    }

    // Skills Animation
    initSkillsAnimation() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const targetWidth = progressBar.getAttribute('data-width');
                    
                    setTimeout(() => {
                        progressBar.style.width = targetWidth + '%';
                    }, 200);
                }
            });
        });
        
        skillBars.forEach(bar => observer.observe(bar));
    }

    // Project Filters
    initProjectFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectItems = document.querySelectorAll('.project-card');
        
        if (!filterButtons.length || !projectItems.length) return;
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');
                
                const filterValue = button.getAttribute('data-filter');
                
                projectItems.forEach(item => {
                    const categories = item.getAttribute('data-category');
                    
                    if (filterValue === 'all' || (categories && categories.includes(filterValue))) {
                        item.classList.remove('hidden');
                        item.style.display = 'block';
                    } else {
                        item.classList.add('hidden');
                        setTimeout(() => {
                            if (item.classList.contains('hidden')) {
                                item.style.display = 'none';
                            }
                        }, 300);
                    }
                });
                
                // Re-trigger AOS animation for visible items
                if (typeof AOS !== 'undefined') {
                    setTimeout(() => {
                        AOS.refresh();
                    }, 300);
                }
            });
        });
    }

    // Contact Form
    initContactForm() {
        const form = document.getElementById('contactForm');
        const successMessage = document.getElementById('successMessage');
        
        if (!form) return;
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const submitButton = form.querySelector('button[type="submit"]');
            
            // Show loading state
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Sending...</span>';
            submitButton.disabled = true;
            
            try {
                // Simulate form submission (replace with actual Google Forms URL)
                await this.simulateFormSubmission(formData);
                
                // Show success message
                if (successMessage) {
                    successMessage.classList.add('show');
                    form.reset();
                    
                    // Hide success message after 5 seconds
                    setTimeout(() => {
                        successMessage.classList.remove('show');
                    }, 5000);
                }
                
            } catch (error) {
                console.error('Form submission error:', error);
                alert('There was an error sending your message. Please try again.');
            }
            
            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        });
    }

    async simulateFormSubmission(formData) {
        // Simulate network delay
        return new Promise(resolve => {
            setTimeout(() => {
                console.log('Form data:', Object.fromEntries(formData));
                resolve();
            }, 2000);
        });
    }

    // Interactive Elements
    initInteractiveElements() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Project card hover effects
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (!this.isMobile) {
                    card.style.transform = 'translateY(-10px) rotateX(5deg)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                if (!this.isMobile) {
                    card.style.transform = 'translateY(0) rotateX(0)';
                }
            });
        });

        // Skill card animations
        const skillCards = document.querySelectorAll('.skill-card');
        skillCards.forEach((card, index) => {
            card.addEventListener('mouseenter', () => {
                if (!this.isMobile) {
                    card.style.transform = 'translateY(-5px) scale(1.02)';
                    card.style.zIndex = '10';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                if (!this.isMobile) {
                    card.style.transform = 'translateY(0) scale(1)';
                    card.style.zIndex = '1';
                }
            });
        });
    }

    // Back to Top Button
    initBackToTop() {
        const backToTop = document.getElementById('backToTop');
        if (!backToTop) return;
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Performance Optimizations
    setupPerformanceOptimizations() {
        // Lazy load images
        this.initLazyLoading();
        
        // Debounce scroll and resize events
        this.debounceEvents();
        
        // Monitor performance
        this.monitorPerformance();
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

    debounceEvents() {
        let scrollTimeout;
        let resizeTimeout;
        
        const originalHandleScroll = this.handleScroll.bind(this);
        const originalHandleResize = this.handleResize.bind(this);
        
        this.handleScroll = () => {
            if (scrollTimeout) {
                cancelAnimationFrame(scrollTimeout);
            }
            scrollTimeout = requestAnimationFrame(originalHandleScroll);
        };
        
        this.handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(originalHandleResize, 150);
        };
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

    enableMobileOptimizations() {
        document.body.classList.add('performance-mode');
        
        // Hide cursor elements
        if (this.cursor) this.cursor.style.display = 'none';
        if (this.cursorFollower) this.cursorFollower.style.display = 'none';
        
        // Disable Three.js on mobile
        if (this.threeScene) {
            const container = document.getElementById('three-container');
            if (container) container.style.display = 'none';
        }
    }

    disableMobileOptimizations() {
        document.body.classList.remove('performance-mode');
        
        // Show cursor elements
        if (this.cursor) this.cursor.style.display = 'block';
        if (this.cursorFollower) this.cursorFollower.style.display = 'block';
        
        // Enable Three.js on desktop
        if (this.threeScene) {
            const container = document.getElementById('three-container');
            if (container) container.style.display = 'block';
        }
    }

    monitorPerformance() {
        if ('performance' in window && 'PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        if (entry.duration > 100) {
                            console.warn('Performance warning:', entry.name, entry.duration);
                        }
                    });
                });
                
                observer.observe({ entryTypes: ['measure', 'navigation'] });
            } catch (e) {
                console.log('Performance monitoring not available');
            }
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
}

// Initialize the app
const portfolioApp = new PortfolioApp();

// Additional utility functions for global use
window.portfolioUtils = {
    smoothScrollTo: (element) => {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    },
    
    showNotification: (message, type = 'info') => {
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
};

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
    ║           Welcome to my portfolio! 🚀                        ║
    ║           Built with modern web technologies                  ║
    ║           Try the Konami code for a surprise! 🎮             ║
    ║                                                               ║
    ╚═══════════════════════════════════════════════════════════════╝
`);

console.log('🎯 Portfolio Features:');
console.log('• 3D Background with Three.js');
console.log('• Custom Cursor Effects');
console.log('• Smooth Animations & Transitions');
console.log('• Responsive Design');
console.log('• Performance Optimized');
console.log('• Easter Eggs Hidden! 🥚');

// Make portfolioApp globally accessible for debugging
window.portfolioApp = portfolioApp;