/**
 * Utility functions for the portfolio
 */

export function initTypewriter(selector, roles) {
    const el = document.querySelector(selector);
    if (!el) return;
    
    let roleIdx = 0, charIdx = 0, isDel = false;
    
    const type = () => {
        const curr = roles[roleIdx];
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

export function initKonamiCode(callback) {
    const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    let input = [];
    document.addEventListener('keydown', (e) => {
        input.push(e.code);
        if (input.length > code.length) input.shift();
        if (input.join(',') === code.join(',')) {
            callback();
        }
    });
}

export function setupPerformanceOptimizations() {
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
