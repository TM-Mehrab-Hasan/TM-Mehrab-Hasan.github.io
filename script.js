// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: true,
    mirror: false
});

// Custom Cursor Functionality
document.addEventListener('DOMContentLoaded', function() {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    // Only enable custom cursor on desktop
    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            setTimeout(() => {
                cursorFollower.style.left = e.clientX + 'px';
                cursorFollower.style.top = e.clientY + 'px';
            }, 100);
        });

        // Cursor hover effects
        const hoverElements = document.querySelectorAll('a, button, .project-card, .skill-item, .filter-btn');
        
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.5)';
                cursorFollower.style.transform = 'scale(1.2)';
                cursorFollower.style.opacity = '0.8';
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursorFollower.style.transform = 'scale(1)';
                cursorFollower.style.opacity = '0.5';
            });
        });
    }
});

// Navbar Scroll Effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Update scroll indicator
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    scrollIndicator.style.width = scrollPercent + '%';
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Three.js 3D Background
function initThreeJS() {
    const container = document.getElementById('three-container');
    if (!container) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 5000;
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 5;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.005,
        color: 0x00ffff,
        transparent: true,
        opacity: 0.8
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Create geometric shapes
    const geometries = [
        new THREE.TetrahedronGeometry(0.1),
        new THREE.OctahedronGeometry(0.1),
        new THREE.IcosahedronGeometry(0.1)
    ];
    
    const shapes = [];
    
    for (let i = 0; i < 20; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = new THREE.MeshBasicMaterial({
            color: Math.random() > 0.5 ? 0x00ffff : 0xff00ff,
            wireframe: true,
            transparent: true,
            opacity: 0.6
        });
        
        const shape = new THREE.Mesh(geometry, material);
        shape.position.set(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
        );
        
        shape.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        
        shapes.push(shape);
        scene.add(shape);
    }
    
    camera.position.z = 2;
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate particles
        particlesMesh.rotation.x += 0.0005;
        particlesMesh.rotation.y += 0.0005;
        
        // Animate shapes
        shapes.forEach((shape, index) => {
            shape.rotation.x += 0.01 + index * 0.001;
            shape.rotation.y += 0.01 + index * 0.001;
            shape.position.y += Math.sin(Date.now() * 0.001 + index) * 0.001;
        });
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Initialize Three.js when page loads
window.addEventListener('load', initThreeJS);

// Typewriter Effect
function typeWriter() {
    const element = document.querySelector('.typewriter');
    if (!element) return;
    
    const text = element.textContent;
    element.textContent = '';
    element.style.borderRight = '0.15em solid #00ffff';
    
    let i = 0;
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, 100);
        }
    }
    
    setTimeout(type, 1500);
}

// Skills Progress Animation
function animateProgress() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const targetWidth = progressBar.getAttribute('data-width');
                progressBar.style.width = targetWidth + '%';
            }
        });
    });
    
    progressBars.forEach(bar => observer.observe(bar));
}

// Project Filtering
function initProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            projectItems.forEach(item => {
                const itemCategories = item.getAttribute('data-category').split(' ');
                
                if (filterValue === 'all' || itemCategories.includes(filterValue)) {
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
        });
    });
}

// Contact Form Handling
function initContactForm() {
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const submitButton = form.querySelector('button[type="submit"]');
        
        // Show loading state
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
        submitButton.disabled = true;
        
        try {
            // Replace with your actual Google Form URL
            const googleFormURL = 'https://docs.google.com/forms/d/e/1FAIpQLScCWsiYcXmyevTx-D5Yy-9OqlloIaekXR1v_35TwPtFs9jo0w/formResponse';
            
            // For demo purposes, we'll simulate a successful submission
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            successMessage.style.display = 'block';
            form.reset();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);
            
        } catch (error) {
            console.error('Form submission error:', error);
            alert('There was an error sending your message. Please try again.');
        }
        
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    });
}

// Parallax Effect
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Intersection Observer for Animations
function initScrollAnimations() {
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
    
    // Observe all sections and cards
    const elementsToObserve = document.querySelectorAll('.section, .about-card, .skill-item, .project-card, .contact-form');
    elementsToObserve.forEach(el => observer.observe(el));
}

// Performance optimization for mobile
function optimizeForMobile() {
    if (window.innerWidth <= 768) {
        // Remove heavy animations on mobile
        const threeContainer = document.getElementById('three-container');
        if (threeContainer) {
            threeContainer.style.display = 'none';
        }
        
        // Simplify animations
        document.body.classList.add('mobile-optimized');
    }
}

// Mouse Move Parallax Effect
function initMouseParallax() {
    if (window.innerWidth <= 768) return;
    
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        const parallaxElements = document.querySelectorAll('.mouse-parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 1;
            const x = (mouseX - 0.5) * speed * 20;
            const y = (mouseY - 0.5) * speed * 20;
            
            element.style.transform = `translateX(${x}px) translateY(${y}px)`;
        });
    });
}

// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    typeWriter();
    animateProgress();
    initProjectFilter();
    initContactForm();
    initParallax();
    initScrollAnimations();
    optimizeForMobile();
    initMouseParallax();
    
    // Add loading animation to body
    document.body.classList.add('loaded');
});

// Handle window resize
window.addEventListener('resize', function() {
    optimizeForMobile();
    
    // Update Three.js canvas size
    const canvas = document.querySelector('#three-container canvas');
    if (canvas) {
        canvas.style.width = '100%';
        canvas.style.height = '100%';
    }
});

// Performance monitoring
function monitorPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            
            if (loadTime > 3000) {
                // If page takes too long to load, disable heavy animations
                document.body.classList.add('performance-mode');
            }
        });
    }
}

monitorPerformance();

// Add smooth reveal animation for elements
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const elementTop = reveal.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('active');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);

// Easter egg - Konami code
let konamiCode = [];
const correctCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    
    if (konamiCode.length > correctCode.length) {
        konamiCode.shift();
    }
    
    if (JSON.stringify(konamiCode) === JSON.stringify(correctCode)) {
        // Easter egg activated - add special effect
        document.body.classList.add('konami-activated');
        
        setTimeout(() => {
            document.body.classList.remove('konami-activated');
        }, 5000);
    }
});

// Add CSS for konami effect
const konamiStyle = document.createElement('style');
konamiStyle.textContent = `
    .konami-activated {
        animation: rainbow 2s linear infinite;
    }
    
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(konamiStyle);