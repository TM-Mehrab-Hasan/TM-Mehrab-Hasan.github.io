/**
 * Theme management for the portfolio
 */
export class ThemeManager {
    constructor() {
        this.btn = document.getElementById('themeToggle');
        if (!this.btn) return;
        
        this.init();
    }

    init() {
        const saved = localStorage.getItem('portfolio-theme');
        if (saved) {
            this.setTheme(saved);
        } else {
            // Default to dark theme as per CSS root variables
            this.setTheme('dark');
        }

        this.btn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            this.setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio-theme', theme);
    }
}
