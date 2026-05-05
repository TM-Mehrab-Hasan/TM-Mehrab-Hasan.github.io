/**
 * Terminal HUD logic for the portfolio
 */
export class TerminalHUD {
    constructor(app) {
        this.app = app;
        this.hud = document.getElementById('terminalHUD');
        this.output = document.getElementById('terminalOutput');
        this.input = document.getElementById('terminalInput');
        this.toggle = document.getElementById('terminalToggle');
        
        if (!this.hud || !this.input) return;
        
        this.commands = {
            'help': () => this.printHelp(),
            'clear': () => this.clear(),
            'about': () => "T. M. Mehrab Hasan: IoT & Robotics Engineer specializing in intelligent systems.",
            'skills': () => "Proficient in Python, C++, Django, IoT (ESP32/Arduino), and Web Dev.",
            'projects': () => "Explore 40+ projects in the Projects section or type 'show projects --iot'.",
            'contact': () => "Email: mehrabratul210524@gmail.com | Phone: +880 1568-901285",
            'system': () => this.getSystemInfo(),
            'github': () => { window.open('https://github.com/TM-Mehrab-Hasan', '_blank'); return "Opening GitHub..."; },
            'cv': () => { window.open('Curriculum Vitae [T. M. Mehrab Hasan].pdf', '_blank'); return "Downloading CV..."; },
            'theme': (args) => this.setTheme(args),
            'whoami': () => "Guest_User@SS_TIER_OS",
            'date': () => new Date().toString()
        };

        this.init();
    }

    init() {
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = this.input.value.trim().toLowerCase();
                this.executeCommand(cmd);
                this.input.value = '';
            }
        });

        this.toggle.addEventListener('click', () => {
            this.hud.classList.toggle('minimized');
            if (!this.hud.classList.contains('minimized')) {
                this.input.focus();
            }
        });

        // Add a small delay before showing terminal
        setTimeout(() => {
            if (window.innerWidth > 768) {
                this.hud.style.opacity = '1';
                this.hud.style.transform = 'translateY(0)';
            }
        }, 3000);
    }

    executeCommand(input) {
        if (!input) return;

        this.addLine(input, 'command-echo');

        const parts = input.split(' ');
        const cmd = parts[0];
        const args = parts.slice(1);

        if (this.commands[cmd]) {
            const result = this.commands[cmd](args);
            if (result) this.addLine(result);
        } else {
            this.addLine(`Command not found: ${cmd}. Type 'help' for assistance.`, 'error');
        }

        // Scroll to bottom
        const body = document.getElementById('terminalBody');
        body.scrollTop = body.scrollHeight;
    }

    addLine(text, type = '') {
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        line.textContent = text;
        this.output.appendChild(line);

        // Keep last 50 lines only
        while (this.output.childNodes.length > 50) {
            this.output.removeChild(this.output.firstChild);
        }
    }

    printHelp() {
        return "Available commands: help, clear, about, skills, projects, contact, system, github, cv, theme [light/dark], whoami, date";
    }

    clear() {
        this.output.innerHTML = '';
        return null;
    }

    getSystemInfo() {
        return `OS: SS-TIER v1.1.0 | Engine: GSAP/Three.js | Status: OPTIMIZED | Resolution: ${window.innerWidth}x${window.innerHeight}`;
    }

    setTheme(args) {
        if (args[0] === 'light' || args[0] === 'dark') {
            this.app.themeManager.setTheme(args[0]);
            return `Theme set to ${args[0]}`;
        }
        return "Usage: theme [light/dark]";
    }
}
