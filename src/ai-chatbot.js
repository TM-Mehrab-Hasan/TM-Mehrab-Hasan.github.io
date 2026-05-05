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
                response: `Mehrab has proven reliability through:
- 40+ successful projects
- 7+ peer-reviewed publications
- CGPA 3.71 in IoT & Robotics
- Strong professional testimonials` 
            },
            {
                patterns: ['project', 'work', 'build', 'developed', 'portfolio', 'what did'],
                response: `He has completed 40+ projects including:
- BITSS VWAR (Security Software)
- BAAZAR X (AI E-commerce)
- Fire Detection Robot
- IoT Environmental Systems`
            },
            {
                patterns: ['skill', 'language', 'tech', 'stack', 'programming', 'proficient', 'expertise'],
                response: `Technical Expertise:
- Backend: Python (Django/Flask), PostgreSQL, MongoDB
- Languages: C++, JavaScript (React)
- AI/ML: TensorFlow, Scikit-learn
- Hardware: ESP32, Arduino, LoRaWAN`
            },
            {
                patterns: ['publication', 'research', 'paper', 'ieee', 'write', 'published', 'conference'],
                response: `Research Highlights:
- 7+ research publications
- 2 papers in IEEE COMPAS 2025
- Focus: Healthcare IoT & Water Quality`
            },
            {
                patterns: ['contact', 'email', 'phone', 'reach', 'connect', 'hire', 'collaborate', 'message'],
                response: `Contact Details:
- Email: mehrabratul210524@gmail.com
- Phone: +880 1568-901285
- Location: Dhaka, Bangladesh`
            },
            {
                patterns: ['experience', 'job', 'work', 'employed', 'career', 'internship', 'bfin', 'perpex'],
                response: `Professional Journey:
- Jr. Software Developer: BFIN IT (Current)
- Intern: PERPEX (India) & Robo Tech Valley
- 2+ years in IoT & Full-stack dev`
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
        const systemPrompt = `You are MEHRAB_AI, the personal assistant for Mehrab Hasan. 
Your goal is to provide concise, smart, and professional information about his career.

MEHRAB'S DATA:
- Role: IoT & Robotics Engineer | Jr. Software Developer at BFIN IT.
- Expertise: Python/Django, C++, React, TensorFlow, ESP32, ML, Cloud.
- Education: B.Sc. IoT & Robotics (CGPA 3.71).
- Key Projects: BITSS VWAR, BAAZAR X, AI-driven Robotics.
- Publications: 7+ research papers (IEEE).

INTELLIGENCE GUIDELINES:
1. FORMATTING: Use bullet points (starting with '-') for lists to avoid "crowded" text.
2. STYLE: Be extremely concise. Use 1-3 lines max unless a list is needed.
3. SMARTNESS: Do not repeat yourself. Answer the specific question asked using the data above.
4. TONE: Professional, technical, and efficient.

Example format:
Here is my experience with IoT:
- Developed 10+ real-time IoT solutions using ESP32 and Arduino.
- Implemented LoRaWAN protocols for environmental monitoring.
- Specialized in sensor integration and edge computing.`;

        const payload = {
            contents: [{
                role: "user",
                parts: [{
                    text: `${systemPrompt}\n\nUser Question: ${userMessage}`
                }]
            }],
            generationConfig: {
                maxOutputTokens: 250,
                temperature: 0.6,
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

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

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
        return "I can provide details about Mehrab's projects, skills, research, and contact information. What would you like to know?";
    }

    addMessage(text, type, isTyping = false) {
        const msg = document.createElement('div');
        msg.className = `message ${type}`;
        if (isTyping) {
            msg.classList.add('typing-indicator');
            msg.textContent = text;
        } else {
            // Process markdown-like lists
            const lines = text.split('\n');
            let html = '';
            let inList = false;

            lines.forEach(line => {
                const trimmed = line.trim();
                if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
                    if (!inList) {
                        html += '<ul>';
                        inList = true;
                    }
                    html += `<li>${trimmed.substring(1).trim()}</li>`;
                } else {
                    if (inList) {
                        html += '</ul>';
                        inList = false;
                    }
                    if (trimmed) html += `<p>${trimmed}</p>`;
                }
            });

            if (inList) html += '</ul>';
            msg.innerHTML = html || `<p>${text}</p>`;
        }

        this.messages.appendChild(msg);
        this.messages.scrollTop = this.messages.scrollHeight;
    }
}
