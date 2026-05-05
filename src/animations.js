/**
 * Animation management for the portfolio using GSAP
 */
export class AnimationManager {
    constructor(app) {
        this.app = app;
        this.animationsInitialized = false;
    }

    init() {
        if (this.animationsInitialized) return;
        this.animationsInitialized = true;

        const sections = document.querySelectorAll('.section');
        
        sections.forEach(section => {
            const heading = section.querySelector('.section-header');
            const cards = section.querySelectorAll('.experience-card, .skill-card-modern, .project-card, .publication-card, .achievement-card, .activity-content');
            
            if (heading) {
                gsap.fromTo(heading, 
                    { y: 40, opacity: 0 },
                    {
                        scrollTrigger: {
                            trigger: heading,
                            start: 'top 90%',
                            toggleActions: 'play none none none'
                        },
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        ease: 'power3.out'
                    }
                );
            }
            
            if (cards.length > 0) {
                gsap.fromTo(cards, 
                    { y: 30, opacity: 0 },
                    {
                        scrollTrigger: {
                            trigger: section,
                            start: 'top 80%',
                            toggleActions: 'play none none none'
                        },
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        stagger: 0.1,
                        ease: 'power2.out'
                    }
                );
            }
        });

        // Hero Content Stagger
        gsap.fromTo('.hero-content > *', 
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.15,
                ease: 'power3.out',
                delay: 0.2
            }
        );

        // 3D Scene Rotation Tie
        if (this.app.threeScene) {
            gsap.to(this.app.threeScene.points.rotation, {
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
}
