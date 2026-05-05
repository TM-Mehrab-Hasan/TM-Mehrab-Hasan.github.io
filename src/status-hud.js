/**
 * Live HUD Status Overlay logic
 */
export class StatusHUD {
    constructor(app) {
        this.app = app;
        this.timeEl = document.getElementById('hudTime');
        this.scrollEl = document.getElementById('hudScroll');
        this.tempEl = document.getElementById('hudTemp');
        
        this.init();
    }

    init() {
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
        
        // Random "Core Temp" fluctuation
        setInterval(() => {
            const temp = 30 + Math.random() * 5;
            if (this.tempEl) this.tempEl.textContent = \`\${temp.toFixed(1)}°C\`;
        }, 5000);
    }

    updateTime() {
        if (!this.timeEl) return;
        
        // Dhaka Time (UTC+6)
        const now = new Date();
        const dhakaTime = new Intl.DateTimeFormat('en-US', {
            timeZone: 'Asia/Dhaka',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).format(now);
        
        this.timeEl.textContent = dhakaTime;
    }

    updateScroll(progress) {
        if (!this.scrollEl) return;
        const percent = Math.round(progress * 100);
        this.scrollEl.textContent = \`\${percent}%\`;
    }
}
