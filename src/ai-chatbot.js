/**
 * AI Research Assistant Chatbot logic with Google Gemini API
 */
export class AIChatbot {
    constructor(app) {
        this.app = app;
        this.hud = document.getElementById('aiChatbot');
        this.messages = document.getElementById('chatMessages');
        this.input = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('sendChat');
        this.toggleBtn = document.getElementById('chatToggle');
        
        // Google Gemini API Configuration
        this.apiKey = 'AIzaSyCf9MufZJ9uYz7rVG3Cb0rSZsmTmeAFrW4';
        this.model = 'gemini-pro';
        this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        
        if (!this.hud || !this.input) return;
        
        // Fallback knowledge base for when API fails
        this.knowledgeBase = [
            { keywords: ['project', 'work', 'build'], response: "40+ projects. Key: BITSS VWAR (security), BAAZAR X (AI ecommerce), Fire Detection Robot." },
            { keywords: ['publication', 'research', 'paper', 'ieee'], response: "7+ publications including 2 IEEE COMPAS 2025 papers on Healthcare IoT and Water Quality." },
            { keywords: ['iot', 'robot', 'esp32', 'arduino'], response: "IoT expert: ESP32, Arduino, embedded systems, sensors, cloud integration." },
            { keywords: ['skill', 'language', 'stack', 'tech'], response: "Python (Django/Flask), C++, JavaScript (React), TensorFlow, scikit-learn." },
            { keywords: ['contact', 'email', 'phone', 'hire'], response: "Email: mehrabratul210524@gmail.com | Phone: +880 1568-901285" },
            { keywords: ['education', 'university', 'degree'], response: "B.Sc. IoT & Robotics from University of Frontier Technology (CGPA: 3.71)." },
            { keywords: ['experience', 'job', 'bfin', 'perpex'], response: "Jr. Dev at BFIN IT. Interned at PERPEX (India) and Robo Tech Valley." }
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

    async handleMessage() {
        const text = this.input.value.trim();
        if (!text) return;

        this.addMessage(text, 'user');
        this.input.value = '';
        
        // Add typing indicator
        this.addMessage('...', 'ai', true);

        try {
            const response = await this.getGeminiResponse(text);
            // Remove typing indicator
            this.messages.removeChild(this.messages.lastChild);
            this.addMessage(response, 'ai');
        } catch (error) {
            console.error('Gemini API error:', error);
            // Remove typing indicator
            this.messages.removeChild(this.messages.lastChild);
            // Fallback to knowledge base
            const response = this.getResponse(text.toLowerCase());
            this.addMessage(response, 'ai');
        }
    }

    async getGeminiResponse(userMessage) {
        const systemPrompt = `You are Mehrab's AI assistant. Answer ONLY about him and his portfolio in 1-2 short sentences. Be concise and direct.
Mehrab: IoT & Robotics Engineer, 40+ projects, 7+ publications, Python/Django/C++/IoT expert.
Email: mehrabratul210524@gmail.com | Phone: +880 1568-901285`;

        try {
            const payload = {
                contents: [{
                    role: "user",
                    parts: [{
                        text: `${systemPrompt}\n\nQuestion: ${userMessage}`
                    }]
                }],
                generationConfig: {
                    maxOutputTokens: 60,
                    temperature: 0.5,
                    topP: 0.8
                },
                safetySettings: [
                    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
                ]
            };

            const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            
            if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                let text = data.candidates[0].content.parts[0].text.trim();
                // Enforce 2-sentence max by truncating at second period if needed
                const sentences = text.split(/[.!?]+/).filter(s => s.trim());
                if (sentences.length > 2) {
                    text = sentences.slice(0, 2).join('. ') + '.';
                }
                return text;
            }
            throw new Error('Invalid API response');
        } catch (error) {
            console.error('Gemini API error:', error);
            throw error;
        }
    }

    addMessage(text, type, isTyping = false) {
        const msg = document.createElement('div');
        msg.className = `message ${type}`;
        if (isTyping) {
            msg.classList.add('typing-indicator');
        }
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
        return "Ask me about Mehrab's projects, skills, experience, education, or contact info!";
    }
}
