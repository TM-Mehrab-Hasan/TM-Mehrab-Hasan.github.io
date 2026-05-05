/**
 * AI Research Assistant Chatbot logic
 */
export class AIChatbot {
    constructor(app) {
        this.app = app;
        this.hud = document.getElementById('aiChatbot');
        this.messages = document.getElementById('chatMessages');
        this.input = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('sendChat');
        this.toggleBtn = document.getElementById('chatToggle');
        
        if (!this.hud || !this.input) return;
        
        this.knowledgeBase = [
            { keywords: ['project', 'work', 'build'], response: "Mehrab has 40+ projects. Highlights include BITSS VWAR (Security Software), BAAZAR X (AI E-commerce), and a Fire Detection Robot." },
            { keywords: ['publication', 'research', 'paper', 'ieee'], response: "He has 7+ publications. Recent work includes 2 papers in IEEE COMPAS 2025 on Healthcare IoT and Water Quality Monitoring." },
            { keywords: ['iot', 'robot', 'esp32', 'arduino'], response: "He's an IoT specialist. Expert in ESP32, Arduino, and embedded systems. Check the 'Skills' section for details." },
            { keywords: ['skill', 'language', 'stack', 'tech'], response: "His stack includes Python (Django/Flask), C++, JavaScript (React), and Machine Learning (Scikit-learn/TensorFlow)." },
            { keywords: ['contact', 'email', 'phone', 'hire'], response: "You can reach him at mehrabratul210524@gmail.com or +880 1568-901285." },
            { keywords: ['education', 'university', 'degree'], response: "He holds a B.Sc. in IoT & Robotics Engineering from the University of Frontier Technology with a CGPA of 3.71." },
            { keywords: ['experience', 'job', 'bfin', 'perpex'], response: "Currently a Jr. Software Developer at BFIN IT. Previously interned at PERPEX (India) and Robo Tech Valley." }
        ];

        this.init();
    }

    init() {
        this.sendBtn.addEventListener('click', () => this.handleMessage());
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.handleMessage();
        });
        this.toggleBtn.addEventListener('click', () => {
            this.hud.classList.toggle('minimized');
        });

        // Initial minimized state
        this.hud.classList.add('minimized');
    }

    handleMessage() {
        const text = this.input.value.trim();
        if (!text) return;

        this.addMessage(text, 'user');
        this.input.value = '';

        // "Thinking" delay
        setTimeout(() => {
            const response = this.getResponse(text.toLowerCase());
            this.addMessage(response, 'ai');
        }, 800);
    }

    addMessage(text, type) {
        const msg = document.createElement('div');
        msg.className = `message ${type}`;
        msg.textContent = text;
        this.messages.appendChild(msg);
        this.messages.scrollTop = this.messages.scrollHeight;
    }

    getResponse(text) {
        for (const item of this.knowledgeBase) {
            if (item.keywords.some(k => text.includes(k))) {
                return item.response;
            }
        }
        return "I'm not sure about that. Try asking about Mehrab's projects, research publications, or specific technical skills like IoT or Django.";
    }
}
