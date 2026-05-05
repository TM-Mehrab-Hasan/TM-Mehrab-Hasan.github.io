/**
 * AI Research Assistant Chatbot logic with Gemini 2.5 Flash Lite API
 */
export class AIChatbot {
    constructor(app) {
        this.app = app;
        this.hud = document.getElementById('aiChatbot');
        this.messages = document.getElementById('chatMessages');
        this.input = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('sendChat');
        this.toggleBtn = document.getElementById('chatToggle');
        
        // Gemini API Configuration
        this.geminiApiKey = 'AIzaSyCf9MufZJ9uYz7rVG3Cb0rSZsmTmeAFrW4';
        this.geminiModel = 'gemini-2.5-flash-lite';
        this.geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${this.geminiModel}:generateContent`;
        
        if (!this.hud || !this.input) return;
        
        // Fallback knowledge base for when API fails
        this.knowledgeBase = [
            { keywords: ['project', 'work', 'build'], response: "40+ projects including BITSS VWAR (Security), BAAZAR X (AI E-commerce), and Fire Detection Robot." },
            { keywords: ['publication', 'research', 'paper', 'ieee'], response: "7+ publications. Recent: 2 papers in IEEE COMPAS 2025 on Healthcare IoT and Water Quality Monitoring." },
            { keywords: ['iot', 'robot', 'esp32', 'arduino'], response: "IoT specialist: ESP32, Arduino, embedded systems expert." },
            { keywords: ['skill', 'language', 'stack', 'tech'], response: "Stack: Python (Django/Flask), C++, JavaScript (React), ML (Scikit-learn/TensorFlow)." },
            { keywords: ['contact', 'email', 'phone', 'hire'], response: "Email: mehrabratul210524@gmail.com | Phone: +880 1568-901285" },
            { keywords: ['education', 'university', 'degree'], response: "B.Sc. in IoT & Robotics Engineering, University of Frontier Technology, CGPA: 3.71" },
            { keywords: ['experience', 'job', 'bfin', 'perpex'], response: "Jr. Software Developer at BFIN IT. Previous: internships at PERPEX (India) and Robo Tech Valley." }
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
        const systemPrompt = `You are Mehrab's AI assistant on his portfolio website. Your role is to answer questions about:
- His projects and work experience
- His technical skills and expertise in IoT, Robotics, and Web Development
- His research and publications
- His background and education
- How to contact him

IMPORTANT: Keep responses SHORT, CONCISE and ACCURATE. Maximum 2-3 sentences. Focus on key information only. 
Answer only about Mehrab Hasan and his portfolio. For unrelated questions, politely redirect.

Context about Mehrab:
- IoT & Robotics Engineer with 40+ projects
- 7+ research publications in IEEE COMPAS 2025
- Skills: Python, Django, C++, JavaScript, ESP32, Arduino, Machine Learning
- Education: B.Sc. in IoT & Robotics Engineering (CGPA: 3.71)
- Current: Jr. Software Developer at BFIN IT
- Contact: mehrabratul210524@gmail.com | +880 1568-901285`;

        const payload = {
            contents: [{
                parts: [{
                    text: `${systemPrompt}\n\nUser Question: ${userMessage}`
                }]
            }],
            generationConfig: {
                maxOutputTokens: 100,
                temperature: 0.7,
                topP: 0.9,
                topK: 40
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        };

        const response = await fetch(`${this.geminiApiUrl}?key=${this.geminiApiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            return aiResponse.trim();
        }

        throw new Error('No response from Gemini API');
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
