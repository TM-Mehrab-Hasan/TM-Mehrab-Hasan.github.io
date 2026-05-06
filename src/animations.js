/**
 * GSAP Animations and Scroll Effects
 * Handled with ScrollTrigger and Custom Micro-interactions
 */
export class Animations {
    constructor(app) {
        this.app = app;
        this.gsap = window.gsap;
        this.ScrollTrigger = window.ScrollTrigger;
        
        if (this.gsap && this.ScrollTrigger) {
            this.gsap.registerPlugin(this.ScrollTrigger);
            this.init();
        }
    }

    init() {
        this.initHeroAnimations();
        this.initSectionEntrance();
        this.initSkillProgress();
        this.initProjectCards();
        this.initThreeJSRotation();
        
        // Refresh ScrollTrigger on resize
        window.addEventListener('resize', () => {
            this.ScrollTrigger.refresh();
        });
    }

    initHeroAnimations() {
        const tl = this.gsap.timeline();
        tl.from('.hero-badge', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' })
          .from('.hero-title', { y: 30, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.4')
          .from('.hero-description', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
          .from('.hero-stats', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
          .from('.hero-actions', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
          .from('.hero-visual', { scale: 0.9, opacity: 0, duration: 1, ease: 'power3.out' }, '-=1');
    }

    initSectionEntrance() {
        const sections = document.querySelectorAll('.section-header');
        sections.forEach(header => {
            this.gsap.from(header, {
                scrollTrigger: {
                    trigger: header,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                y: 30,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });
        });
    }

    initSkillProgress() {
        const skillBars = document.querySelectorAll('.skill-fill');
        skillBars.forEach(bar => {
            const targetWidth = bar.style.width;
            bar.style.width = '0%';
            
            this.gsap.to(bar, {
                scrollTrigger: {
                    trigger: bar,
                    start: 'top 90%',
                },
                width: targetWidth,
                duration: 1.5,
                ease: 'power4.out'
            });
        });

        // Entrance for skill cards
        const cards = document.querySelectorAll('.skill-card-modern');
        this.gsap.from(cards, {
            scrollTrigger: {
                trigger: '.skills-interactive-grid',
                start: 'top 80%',
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
            // On complete, ensure opacity is 1 and style is cleared to prevent CSS conflicts
            onComplete: () => {
                cards.forEach(card => this.gsap.set(card, { clearProps: "all" }));
            }
        });
    }

    initProjectCards() {
        const cards = document.querySelectorAll('.project-card, .experience-card, .publication-card, .achievement-card, .activity-item');
        cards.forEach(card => {
            this.gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 88%',
                    toggleActions: 'play none none none'
                },
                y: 40,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });
        });
    }

    initThreeJSRotation() {
        // Only run rotation tie on desktop to save performance
        if (window.innerWidth <= 768) return;

        const threeScene = this.app.threeScene;
        if (!threeScene || !threeScene.points) return;

        this.gsap.to(threeScene.points.rotation, {
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1
            },
            y: Math.PI * 2,
            z: Math.PI
        });
    }
}