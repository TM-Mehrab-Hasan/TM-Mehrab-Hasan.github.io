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
            this.initThemeToggle();
            this.initBlogInteractions();
            this.initKonamiCode();
            this.initTestimonials();
            this.initProjectDemos();
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

    // Skills Animation & Interaction
    initSkillsAnimation() {
        const skillBars = document.querySelectorAll('.skill-fill');
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
                            // Add a glow effect when animating
                            progressBar.style.boxShadow = `0 0 20px rgba(99, 102, 241, 0.5)`;
                            
                            // Remove glow after animation
                            setTimeout(() => {
                                progressBar.style.boxShadow = '';
                            }, 1000);
                        }, Math.random() * 300 + 100); // Staggered animation
                    }
                }
            });
        }, { threshold: 0.3 });
        
        skillCards.forEach(card => observer.observe(card));
        
        // Skills category filtering
        skillNavButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.getAttribute('data-category');
                
                // Update active button
                skillNavButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter cards
                skillCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    
                    if (category === 'all' || cardCategory === category) {
                        card.style.display = 'block';
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, Math.random() * 200 + 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(-20px)';
                        setTimeout(() => {
                            if (card.style.opacity === '0') {
                                card.style.display = 'none';
                            }
                        }, 300);
                    }
                });
                
                // Update stats based on visible skills
                this.updateSkillsStats(category);
            });
        });
        
        // Enhanced hover effects for skill cards
        skillCards.forEach(card => {
            const skillIcon = card.querySelector('.skill-icon-modern i');
            const skillGlow = card.querySelector('.skill-glow');
            const hoverInfo = card.querySelector('.skill-hover-info');
            
            card.addEventListener('mouseenter', () => {
                if (!this.isMobile) {
                    // Icon animation
                    if (skillIcon) {
                        skillIcon.style.transform = 'scale(1.2) rotate(5deg)';
                        skillIcon.style.filter = 'brightness(1.2)';
                    }
                    
                    // Glow effect
                    if (skillGlow) {
                        skillGlow.style.opacity = '0.8';
                        skillGlow.style.transform = 'scale(1.5)';
                    }
                    
                    // Show hover info
                    if (hoverInfo) {
                        hoverInfo.style.opacity = '1';
                        hoverInfo.style.transform = 'translateY(0)';
                    }
                    
                    // Card transform
                    card.style.transform = 'translateY(-10px) scale(1.02)';
                    card.style.zIndex = '10';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                if (!this.isMobile) {
                    // Reset icon
                    if (skillIcon) {
                        skillIcon.style.transform = 'scale(1) rotate(0deg)';
                        skillIcon.style.filter = 'brightness(1)';
                    }
                    
                    // Reset glow
                    if (skillGlow) {
                        skillGlow.style.opacity = '0.3';
                        skillGlow.style.transform = 'scale(1)';
                    }
                    
                    // Hide hover info
                    if (hoverInfo) {
                        hoverInfo.style.opacity = '0';
                        hoverInfo.style.transform = 'translateY(10px)';
                    }
                    
                    // Reset card
                    card.style.transform = 'translateY(0) scale(1)';
                    card.style.zIndex = '1';
                }
            });
            
            // Click effect for mobile
            card.addEventListener('click', () => {
                if (this.isMobile && hoverInfo) {
                    const isVisible = hoverInfo.style.opacity === '1';
                    hoverInfo.style.opacity = isVisible ? '0' : '1';
                    hoverInfo.style.transform = isVisible ? 'translateY(10px)' : 'translateY(0)';
                }
            });
        });
        
        // Initialize with all skills visible
        this.updateSkillsStats('all');
    }
    
    // Update skills statistics based on visible skills
    updateSkillsStats(category) {
        const allCards = document.querySelectorAll('.skill-card-modern');
        const visibleCards = category === 'all' 
            ? allCards 
            : document.querySelectorAll(`.skill-card-modern[data-category="${category}"]`);
        
        const totalSkillsEl = document.getElementById('totalSkills');
        const avgExperienceEl = document.getElementById('avgExperience');
        const specialtySkillsEl = document.getElementById('specialtySkills');
        const avgProficiencyEl = document.getElementById('avgProficiency');
        
        if (!totalSkillsEl) return;
        
        // Calculate stats
        let totalProficiency = 0;
        let totalExperience = 0;
        let specialtyCount = 0;
        
        visibleCards.forEach(card => {
            const progressBar = card.querySelector('.skill-fill');
            const experienceEl = card.querySelector('.skill-experience');
            const isSpecialty = card.classList.contains('featured');
            
            if (progressBar) {
                totalProficiency += parseInt(progressBar.getAttribute('data-width'));
            }
            
            if (experienceEl) {
                const experienceText = experienceEl.textContent;
                const experienceValue = parseFloat(experienceText.match(/\d+\.?\d*/));
                totalExperience += experienceValue || 0;
            }
            
            if (isSpecialty) {
                specialtyCount++;
            }
        });
        
        const count = visibleCards.length;
        const avgProficiency = count > 0 ? Math.round(totalProficiency / count) : 0;
        const avgExperience = count > 0 ? (totalExperience / count).toFixed(1) : 0;
        
        // Animate the numbers
        this.animateNumber(totalSkillsEl, parseInt(totalSkillsEl.textContent), count);
        this.animateNumber(avgExperienceEl, parseFloat(avgExperienceEl.textContent), avgExperience, true);
        this.animateNumber(specialtySkillsEl, parseInt(specialtySkillsEl.textContent), specialtyCount);
        this.animateNumber(avgProficiencyEl, parseInt(avgProficiencyEl.textContent), avgProficiency);
    }
    
    // Animate number changes
    animateNumber(element, startValue, endValue, isFloat = false) {
        const duration = 1000;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Use easing function for smooth animation
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            
            const currentValue = startValue + (endValue - startValue) * easedProgress;
            
            if (isFloat) {
                element.textContent = currentValue.toFixed(1);
            } else {
                element.textContent = Math.round(currentValue);
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = isFloat ? endValue.toString() : endValue.toString();
            }
        };
        
        requestAnimationFrame(animate);
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
    // Google Forms submission
    const GOOGLE_FORMS_URL = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLScCWsiYcXmyevTx-D5Yy-9OqlloIaekXR1v_35TwPtFs9jo0w/formResponse';
    
    try {
        // Create a new FormData for Google Forms
        const googleFormData = new FormData();
        
        // Map form fields to Google Forms entry IDs (these match the ones in your HTML)
        googleFormData.append('entry.166786655', formData.get('entry.166786655')); // name
        googleFormData.append('entry.101374180', formData.get('entry.101374180')); // email
        googleFormData.append('entry.1647048671', formData.get('entry.1647048671')); // subject
        googleFormData.append('entry.779883203', formData.get('entry.779883203')); // message
        
        // Submit to Google Forms (note: this will likely be blocked by CORS, so we use a different approach)
        const response = await fetch(GOOGLE_FORMS_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: googleFormData
        });
        
        // Since no-cors mode doesn't return response data, we assume success
        return Promise.resolve();
        
        } catch (error) {
            console.error('Google Forms submission error:', error);
            
            // Fallback: Send email using mailto (this will open the user's email client)
            const emailData = {
                name: formData.get('entry.166786655'),
                email: formData.get('entry.101374180'),
                subject: formData.get('entry.1647048671'),
                message: formData.get('entry.779883203')
            };
            
            const mailtoLink = `mailto:tmmehrabhasan@gmail.com?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(
                `Name: ${emailData.name}\nEmail: ${emailData.email}\n\nMessage:\n${emailData.message}`
            )}`;
            
            window.open(mailtoLink);
            return Promise.resolve();
        }
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

    // Theme Toggle
    initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        // Load saved theme or default to dark
        const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);

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