/**
 * Utility functions for the portfolio
 */

export function initTypewriter(selector, roles) {
    const el = document.querySelector(selector);
    if (!el) return;
    
    let roleIdx = 0, charIdx = 0, isDel = false;
    
    const type = () => {
        const curr = roles[roleIdx];
        // Designation name update
        el.textContent = isDel ? curr.substring(0, charIdx--) : curr.substring(0, charIdx++);
        
        if (!isDel && charIdx > curr.length) { 
            isDel = true; 
            setTimeout(type, 2000); 
        } else if (isDel && charIdx < 0) { 
            isDel = false; 
            roleIdx = (roleIdx + 1) % roles.length; 
            setTimeout(type, 500); 
        } else { 
            setTimeout(type, isDel ? 50 : 100); 
        }
    };
    type();
}

export function setupBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

export function setupPerformanceOptimizations() {
    // Detect low-spec devices
    const isLowSpec = (
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
        (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
        (window.innerWidth <= 768)
    );
    
    if (isLowSpec) {
        document.body.classList.add('low-perf');
    }

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

export function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const successMsg = document.querySelector('.success-message');

        if (submitBtn) submitBtn.disabled = true;

        try {
            const googleFormUrl = form.getAttribute('action');
            if (googleFormUrl) {
                await fetch(googleFormUrl, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: formData
                });
            }
            
            form.style.display = 'none';
            if (successMsg) successMsg.classList.add('show');
        } catch (error) {
            console.error('Submission error:', error);
            alert('Something went wrong. Please try again or email directly.');
            if (submitBtn) submitBtn.disabled = false;
        }
    });
}

export function setupScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
        
        // Update Scroll HUD
        const hudScroll = document.getElementById('hudScroll');
        if (hudScroll) {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            hudScroll.textContent = Math.round(scrolled) + '%';
        }
    });
}
