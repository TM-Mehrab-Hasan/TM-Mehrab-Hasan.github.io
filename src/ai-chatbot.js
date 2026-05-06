/**
 * Sensei - Mehrab's AI Assistant
 * Gemini 1.5 Flash powered with intelligent fallback
 */
export class AIChatbot {
    constructor(app) {
        this.app = app;
        this.hud = document.getElementById('aiChatbot');
        this.messages = document.getElementById('chatMessages');
        this.input = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('sendChat');
        this.toggleBtn = document.querySelector('.chat-toggle');

        // Extended knowledge base patterns for fallback
        this.responsePatterns = [
            {
                patterns: ['reliable', 'trustworthy', 'trust', 'honest', 'dependable', 'integrity'],
                response: `Mehrab Hasan has proven reliability through:
- 40+ successful projects (BITSS VWAR, BAAZAR X, etc.)
- 7+ peer-reviewed research publications (IEEE)
- B.Sc. in IoT & Robotics with CGPA 3.71
- Recognized with Dean's Award & Dean's List`
            },
            {
                patterns: ['project', 'work', 'build', 'developed', 'portfolio', 'what did'],
                response: `He has completed 40+ projects including:
- BITSS VWAR: Security software for malware detection
- BAAZAR X: Full-stack AI-driven E-commerce
- Smart Drainage Solution: IoT system for urban management
- Fire Detection Robot: Autonomous safety system`
            },
            {
                patterns: ['skill', 'language', 'tech', 'stack', 'programming', 'proficient', 'expertise'],
                response: `Technical Expertise:
- Backend: Python (Django/Flask), PHP (MySQL), Node.js
- Frontend: HTML5, CSS3, JavaScript (React)
- AI/ML: TensorFlow, Scikit-learn, Explainable AI
- Hardware/IoT: ESP32, Arduino, LoRaWAN, Embedded Systems`
            },
            {
                patterns: ['publication', 'research', 'paper', 'ieee', 'write', 'published', 'conference'],
                response: `Research Highlights (7+ publications):
- "Intelligent Investment Advisor" (Stacked ML, 2025)
- "Smart IoT Solution for Drainage Congestion" (IEEE ICPS 2024)
- Focus areas: Healthcare IoT, Water Quality, and Explainable AI`
            },
            {
                patterns: ['contact', 'email', 'phone', 'reach', 'connect', 'hire', 'collaborate', 'message'],
                response: `You can reach Mehrab here:
- Email: mehrabratul210524@gmail.com
- Phone: +880 1880 021052
- Location: Dhaka, Bangladesh`
            },
            {
                patterns: ['experience', 'job', 'work', 'employed', 'career', 'internship', 'bfin', 'nsr'],
                response: `Professional Journey:
- Jr. Software Developer: BFIN IT PVT. LTD. (BITSS VWAR development)
- Django Backend Developer: NSR DEV (Remote)
- Intern: Robo Tech Valley & PERPEX (India)`
            },
            {
                patterns: ['activity', 'club', 'leadership', 'volunteer', 'extracurricular'],
                response: `Leadership & Activities:
- Deputy Organizing Secretary: UFTB Robotics Club
- Executive Officer: UFTB Programming Club
- Program Secretary: UFTB Cultural Club
- Korean Language Secretary: UFTB Language Club`
            },
            {
                patterns: ['education', 'study', 'university', 'college', 'degree', 'cgpa'],
                response: `Academic Background:
- B.Sc. in IoT & Robotics: University of Frontier Technology (CGPA: 3.71)
- HSC & SSC: Notre Dame College, Dhaka (GPA: 5.00/5.00)`
            },
            {
                patterns: ['award', 'achievement', 'recognition', 'medal', 'dean'],
                response: `Key Recognitions:
- Dean's Award & Dean's List (UFT)
- 1st Place: Applink Innovation Contest ("Intelligent Law Advisor")
- 3rd Runner Up: Upazila Science Fair
- 10+ Professional Certifications (AWS, OPSWAT, Python, Cybersecurity)`
            },
            {
                patterns: ['testimonial', 'recommendation', 'feedback', 'review', 'what people say'],
                response: `What Professionals Say:
- Ahsanul Akib (MD, Robo Tech Valley): "Exceptional work on IoT systems... a true professional."
- Prof. Dr. Abu Yousuf (VC, UFT): "Innovative approach to complex problems... sets him apart."
- NSR DEV Team: "Clean, well-documented code... follows best practices."`
            }
        ];

        this.init();
    }

    init() {
        if (!this.hud || !this.sendBtn || !this.input) return;

        this.sendBtn.addEventListener('click', () => this.handleMessage());
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.handleMessage();
        });

        this.toggleBtn.addEventListener('click', () => {
            this.hud.classList.toggle('minimized');
        });

        const observer = new MutationObserver(() => {
            this.messages.scrollTop = this.messages.scrollHeight;
        });
        this.messages && observer.observe(this.messages, { childList: true });

        if (window.innerWidth <= 768) {
            this.hud.classList.add('minimized');
        } else {
            this.hud.classList.remove('minimized');
        }
    }

    async handleMessage() {
        const text = this.input.value.trim();
        if (!text) return;

        this.addMessage(text, 'user');
        this.input.value = '';
        this.addMessage('...', 'ai', true);

        try {
            const response = await this.getGeminiResponse(text);
            const typingIndicators = this.messages.querySelectorAll('.typing-indicator');
            typingIndicators.forEach(el => this.messages.removeChild(el));
            this.addMessage(response, 'ai');
        } catch (error) {
            console.error('API Error - Using Fallback:', error);
            const typingIndicators = this.messages.querySelectorAll('.typing-indicator');
            typingIndicators.forEach(el => this.messages.removeChild(el));
            const response = this.getResponse(text.toLowerCase());
            this.addMessage(response, 'ai');
        }
    }

    async getGeminiResponse(userMessage) {
        const systemPrompt = `You are Sensei, the professional AI assistant for T. M. Mehrab Hasan.
Your goal is to provide concise, technical, and accurate information about his career, skills, and projects.

MEHRAB'S COMPREHENSIVE DATA:
- Role: IoT & Robotics Engineer | Jr. Software Developer at BFIN IT.
- Expertise: Python (Django), C++, JavaScript (React), PHP, MySQL, TensorFlow, ESP32, LoRaWAN.
- Education: B.Sc. IoT & Robotics (University of Frontier Technology, CGPA 3.71). HSC/SSC GPA 5.00 (Notre Dame College).
- Key Projects: BITSS VWAR (Security/Malware detection), BAAZAR X (AI E-commerce), Smart Drainage Solution (IoT/ML).
- Publications: 7+ papers (IEEE). Topics: Explainable AI, Healthcare IoT, Smart City tech.
- Achievements: Dean's Award, Dean's List, OPSWAT CIP Certification, Cyber Security certificates.
- Activities: Leadership in Robotics, Programming, Cultural, and Language clubs. Managed international collaborations.
- Career Goal: Building production-ready software and innovative IoT solutions.

INTELLIGENCE GUIDELINES:
1. FORMATTING: Use bullet points (starting with '-') for lists. Use 1-3 sentences for paragraphs.
2. STYLE: Extremely concise. Don't fluff. Technical but accessible.
3. CONTEXT: If asked about something not in the data, politely say you only have information about Mehrab's professional portfolio.
4. PERSONALITY: Wise, efficient, and professional (like a 'Sensei').

Example:
User: "What is his experience?"
AI: "Mehrab is currently a Jr. Software Developer at BFIN IT, developing BITSS VWAR for malware detection. He also works as a remote Django developer at NSR DEV and has internship experience in IoT and Robotics."`;

        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${userMessage}` }] }]
            })
        });

        if (!response.ok) throw new Error('API request failed');
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    getResponse(text) {
        for (const item of this.responsePatterns) {
            if (item.patterns.some(p => text.includes(p))) {
                return item.response;
            }
        }
        return "I'm Sensei, Mehrab's Assistant. I can tell you about Mehrab's skills, 40+ projects, 7+ research publications, education, and professional experience. What would you like to know?";
    }

    addMessage(text, type, isTyping = false) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${type} ${isTyping ? 'typing-indicator' : ''}`;

        if (!isTyping) {
            if (text.includes('- ')) {
                const parts = text.split('\n');
                let html = '';
                let inList = false;

                parts.forEach(part => {
                    if (part.startsWith('- ')) {
                        if (!inList) { html += '<ul>'; inList = true; }
                        html += `<li>${part.substring(2)}</li>`;
                    } else {
                        if (inList) { html += '</ul>'; inList = false; }
                        html += `<p>${part}</p>`;
                    }
                });
                if (inList) html += '</ul>';
                msgDiv.innerHTML = html;
            } else {
                msgDiv.textContent = text;
            }
        }

        this.messages.appendChild(msgDiv);
        this.messages.scrollTop = this.messages.scrollHeight;
    }
}