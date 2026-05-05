/**
 * AI Chatbot with Gemini 1.5 Flash - Real-time + Intelligent Fallback
 * Header-based API authentication with portfolio context knowledge
 */
export class AIChatbot {
    constructor(app) {
        this.app = app;
        this.hud = document.getElementById('aiChatbot');
        this.messages = document.getElementById('chatMessages');
        this.input = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('sendChat');
        this.toggleBtn = document.getElementById('chatToggle');

        // Gemini API Configuration (Model updated to 1.5 Flash)
        this.apiKey = 'AIzaSyCf9MufZJ9uYz7rVG3Cb0rSZsmTmeAFrW4';
        this.model = 'gemini-1.5-flash';
        this.apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent`;

        if (!this.hud || !this.input) return;

        // Intelligent response patterns with portfolio knowledge
        this.responsePatterns = [
            {
                patterns: ['reliable', 'trustworthy', 'trust', 'honest', 'dependable', 'integrity'],
                response: `Yes! Mehrab has proven reliability: 40+ successful projects, 7+ peer-reviewed publications, CGPA 3.71, and strong testimonials from colleagues. His code follows best practices and is well-documented.` 
            },
            {
                patterns: ['project', 'work', 'build', 'developed', 'portfolio', 'what did'],
                response: `40+ completed projects: BITSS VWAR (Security Software), BAAZAR X (AI E-commerce), Fire Detection Robot, IoT environmental systems. See Projects section for full portfolio and case studies.`
            },
            {
                patterns: ['skill', 'language', 'tech', 'stack', 'programming', 'proficient', 'expertise'],
                response: `Python (Django/Flask), C++, JavaScript (React), TensorFlow, Scikit-learn, ESP32, Arduino, MQTT, LoRaWAN, PostgreSQL, MongoDB, Git, Docker, REST APIs.`
            },
            {
                patterns: ['publication', 'research', 'paper', 'ieee', 'write', 'published', 'conference'],
                response: `7+ research publications including 2 papers in IEEE COMPAS 2025: Healthcare IoT Systems and Water Quality Monitoring. Strong research and technical writing abilities.`
            },
            {
                patterns: ['contact', 'email', 'phone', 'reach', 'connect', 'hire', 'collaborate', 'message'],
                response: `Email: mehrabratul210524@gmail.com | Phone: +880 1568-901285 | Dhaka, Bangladesh. Available for projects, collaborations, and opportunities!`
            },
            {
                patterns: ['education', 'university', 'degree', 'study', 'background', 'college', 'graduat'],
                response: `B.Sc. in IoT & Robotics Engineering from University of Frontier Technology (CGPA 3.71). Strong foundation in embedded systems, robotics, and software engineering.`
            },
            {
                patterns: ['experience', 'job', 'work', 'employed', 'career', 'internship', 'bfin', 'perpex'],
                response: `Jr. Software Developer at BFIN IT (current). Internships: PERPEX (India), Robo Tech Valley. 2+ years in IoT, robotics, and full-stack development.`
            },
            {
                patterns: ['iot', 'robot', 'esp32', 'arduino', 'embedded', 'sensor', 'microcontroller'],
                response: `IoT & Robotics expert: ESP32, Arduino, embedded systems design, sensor integration, MQTT/LoRaWAN protocols. Developed multiple real-time IoT solutions.`
            },
            {
                patterns: ['django', 'python', 'backend', 'web', 'rest', 'api', 'server', 'database'],
                response: `Django & Python backend specialist: REST APIs, database design (PostgreSQL/MongoDB), full-stack solutions. BAAZAR X is a notable Django/React project.`
            },
            {
                patterns: ['machine learning', 'ai', 'neural', 'tensorflow', 'scikit', 'algorithm'],
                response: `ML experience: TensorFlow, Scikit-learn, neural networks, data preprocessing. Integrates ML into IoT systems for intelligent edge computing.`
            },
            {
                patterns: ['available', 'freelance', 'contract', 'open', 'opportunity', 'looking', 'hire me'],
                response: `Available for freelance projects, contract work, and full-time roles. Contact: mehrabratul210524@gmail.com to discuss opportunities!`
            },
            {
                patterns: ['react', 'javascript', 'frontend', 'ui', 'ux', 'client', 'browser'],
                response: `React & JavaScript frontend development. Responsive UI/UX design, modern web standards. Combines React frontend with Python/Django backend for full-stack apps.`
            }
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
        this.hud.classList.add('minimized');
    }

    async handleMessage() {
        const text = this.input.value.trim();
        if (!text) return;

        this.addMessage(text, 'user');
        this.input.value = '';
        this.addMessage('...', 'ai', true);

        try {
            const response = await this.getGeminiResponse(text);
            this.messages.removeChild(this.messages.lastChild);
            this.addMessage(response, 'ai');
        } catch (error) {
            console.error('API Error - Using Fallback:', error);
            if (this.messages.lastChild && this.messages.lastChild.classList.contains('typing-indicator')) {
                this.messages.removeChild(this.messages.lastChild);
            }
            const response = this.getResponse(text.toLowerCase());
            this.addMessage(response, 'ai');
        }
    }

    async getGeminiResponse(userMessage) {
        const systemPrompt = `You are Mehrab Hasan's AI assistant. Answer questions about his portfolio accurately and professionally.

MEHRAB'S PROFILE:
- IoT & Robotics Engineer | Jr. Software Developer at BFIN IT
- Education: B.Sc. IoT & Robotics, University of Frontier Technology (CGPA 3.71)
- Location: Dhaka, Bangladesh
- Contact: mehrabratul210524@gmail.com | +880 1568-901285

PROJECTS (40+): BITSS VWAR, BAAZAR X, Fire Detection Robot, IoT systems
PUBLICATIONS (7+): 2 IEEE COMPAS 2025 papers (Healthcare IoT, Water Quality)
SKILLS: Python/Django, C++, React, TensorFlow, ESP32/Arduino, ML, Cloud

RESPONSE GUIDELINES:
- Keep answers 1-2 sentences.
- Be professional and helpful.
- Suggest Terminal HUD commands where relevant.
- Example: "You can see my full skill tree by typing 'skills' in the Terminal."
- Available Terminal commands: help, clear, about, skills, projects, contact, system, github, cv, theme [light/dark], whoami, date, ai.`;

        const payload = {
            contents: [{
                role: "user",
                parts: [{
                    text: `${systemPrompt}\n\nQuestion: ${userMessage}`
                }]
            }],
            generationConfig: {
                maxOutputTokens: 150,
                temperature: 0.7,
                topP: 0.9
            }
        };

        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': this.apiKey
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
            return data.candidates[0].content.parts[0].text.trim();
        }
        throw new Error('Invalid response');
    }

    getResponse(text) {
        for (const pattern of this.responsePatterns) {
            if (pattern.patterns.some(p => text.includes(p))) {
                return pattern.response;
            }
        }
        return "Ask about Mehrab's projects, skills (Python, Django, IoT, C++, React), experience, education, publications, or contact!";
    }

    addMessage(text, type, isTyping = false) {
        const msg = document.createElement('div');
        msg.className = `message ${type}`;
        if (isTyping) msg.classList.add('typing-indicator');
        msg.textContent = text;
        this.messages.appendChild(msg);
        this.messages.scrollTop = this.messages.scrollHeight;
    }
}
