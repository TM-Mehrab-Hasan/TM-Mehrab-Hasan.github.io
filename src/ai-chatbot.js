/**
 * AI Research Assistant Chatbot logic with Google Gemini 2.5 Flash Lite API
 * Provides intelligent, real-time responses about Mehrab's portfolio
 */
export class AIChatbot {
    constructor(app) {
        this.app = app;
        this.hud = document.getElementById('aiChatbot');
        this.messages = document.getElementById('chatMessages');
        this.input = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('sendChat');
        this.toggleBtn = document.getElementById('chatToggle');
        
        // Google Gemini API Configuration - gemini-2.5-flash-lite
        this.apiKey = 'AIzaSyCf9MufZJ9uYz7rVG3Cb0rSZsmTmeAFrW4';
        this.model = 'gemini-2.5-flash-lite';
        this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent';
        
        if (!this.hud || !this.input) return;
        
        // Comprehensive knowledge base with portfolio context
        this.portfolioContext = {
            name: "T. M. Mehrab Hasan",
            title: "IoT & Robotics Engineer",
            location: "Dhaka, Bangladesh",
            email: "mehrabratul210524@gmail.com",
            phone: "+880 1568-901285",
            education: "B.Sc. in IoT & Robotics Engineering from University of Frontier Technology (CGPA: 3.71)",
            experience: "Jr. Software Developer at BFIN IT | Internships: PERPEX (India), Robo Tech Valley",
            projects: "40+ projects including BITSS VWAR (Security Software), BAAZAR X (AI E-commerce Platform), Fire Detection Robot, IoT monitoring systems",
            publications: "7+ research publications including 2 papers in IEEE COMPAS 2025 (Healthcare IoT, Water Quality Monitoring)",
            skills: {
                languages: "Python, C++, JavaScript",
                frameworks: "Django, Flask, React",
                iot: "ESP32, Arduino, embedded systems, sensors, cloud integration",
                ml: "TensorFlow, Scikit-learn, Machine Learning",
                databases: "PostgreSQL, MongoDB",
                other: "Git, Docker, REST APIs, MQTT, LoRaWAN"
            },
            expertise: "IoT systems, Robotics, Web Development (Django/Python), Embedded Systems, Machine Learning, Cloud Platforms"
        };
        
        // Intelligent response patterns
        this.responsePatterns = [
            { 
                patterns: ['reliable', 'trustworthy', 'trust', 'honest', 'dependable'],
                response: `Absolutely! Mehrab has proven reliability through 40+ successful projects and 7+ peer-reviewed publications. His code follows best practices, is well-documented, and maintains high CGPA (3.71). Multiple testimonials from colleagues and supervisors confirm his professionalism.`
            },
            {
                patterns: ['project', 'work', 'build', 'developed', 'portfolio'],
                response: `Mehrab has 40+ projects showcasing expertise in IoT, Robotics, and Web Development. Notable: BITSS VWAR (Security Software), BAAZAR X (AI E-commerce), Fire Detection Robot. See the Projects section for full portfolio.`
            },
            {
                patterns: ['skill', 'language', 'tech', 'stack', 'programming'],
                response: `Tech Stack: Python (Django/Flask), C++, JavaScript (React). ML: TensorFlow, Scikit-learn. IoT: ESP32, Arduino, embedded systems. Databases: PostgreSQL, MongoDB. Also Git, Docker, REST APIs, MQTT.`
            },
            {
                patterns: ['publication', 'research', 'paper', 'ieee', 'write', 'published'],
                response: `7+ research publications including 2 papers in IEEE COMPAS 2025 on Healthcare IoT Systems and Water Quality Monitoring. Demonstrates strong research and technical writing abilities.`
            },
            {
                patterns: ['contact', 'email', 'phone', 'reach', 'connect', 'hire', 'collaborate'],
                response: `Connect with Mehrab: Email: mehrabratul210524@gmail.com | Phone: +880 1568-901285 | LinkedIn and GitHub profiles available on portfolio.`
            },
            {
                patterns: ['education', 'university', 'degree', 'study', 'background'],
                response: `B.Sc. in IoT & Robotics Engineering from University of Frontier Technology with CGPA 3.71. Strong foundation in embedded systems, robotics, and software engineering.`
            },
            {
                patterns: ['experience', 'job', 'work', 'employed', 'career', 'background'],
                response: `Currently Jr. Software Developer at BFIN IT. Previous internships at PERPEX (India) as developer and Robo Tech Valley. Combined 2+ years in IoT and software development.`
            },
            {
                patterns: ['iot', 'robot', 'esp32', 'arduino', 'embedded', 'sensor', 'microcontroller'],
                response: `IoT & Robotics Specialist: Expert in ESP32, Arduino, embedded systems design, sensor integration, cloud connectivity (MQTT, LoRaWAN), and real-time systems. Developed multiple IoT projects.`
            },
            {
                patterns: ['reliable', 'quality', 'clean code', 'best practice', 'professional'],
                response: `Mehrab prioritizes code quality, documentation, and best practices. His work demonstrates professionalism through 40+ completed projects, successful internships, and 7+ peer-reviewed publications.`
            },
            {
                patterns: ['django', 'python', 'backend', 'web development', 'full stack'],
                response: `Proficient in Django and Python for backend development. Experienced with REST APIs, database design (PostgreSQL), and full-stack web applications. BAAZAR X (AI E-commerce) is a notable Django project.`
            },
            {
                patterns: ['machine learning', 'ai', 'neural', 'tensorflow', 'scikit'],
                response: `ML Skills: TensorFlow, Scikit-learn, Python. Experience with data preprocessing, model training, and deployment. Integrates ML into IoT systems for intelligent edge computing.`
            },
            {
                patterns: ['available', 'freelance', 'contract', 'project', 'open', 'available'],
                response: `Mehrab is available for freelance projects, contract work, and full-time opportunities. Contact: mehrabratul210524@gmail.com or +880 1568-901285 to discuss collaboration.`
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
        const systemPrompt = `You are Mehrab's AI assistant on his portfolio website. Answer questions about Mehrab, his projects, skills, and experience concisely (1-2 sentences max).

About Mehrab:
- IoT & Robotics Engineer from University of Frontier Technology
- 40+ projects: BITSS VWAR, BAAZAR X (AI ecommerce), Fire Detection Robot
- 7+ publications including IEEE COMPAS 2025 papers
- Skills: Python (Django), C++, JavaScript (React), TensorFlow, ESP32/Arduino
- Current: Jr. Dev at BFIN IT
- Contact: mehrabratul210524@gmail.com | +880 1568-901285
- CGPA: 3.71

Be helpful, accurate, and professional. Only answer about Mehrab's portfolio.`;

        try {
            const payload = {
                contents: [{
                    parts: [{
                        text: `${systemPrompt}\n\nUser: ${userMessage}`
                    }]
                }],
                generationConfig: {
                    maxOutputTokens: 80,
                    temperature: 0.3,
                    topP: 0.7
                }
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
                return data.candidates[0].content.parts[0].text.trim();
            }
            throw new Error('No response');
        } catch (error) {
            console.error('Gemini API Error:', error);
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
        const lowerText = text.toLowerCase();
        
        // Check response patterns for intelligent matching
        for (const pattern of this.responsePatterns) {
            if (pattern.patterns.some(p => lowerText.includes(p))) {
                return pattern.response;
            }
        }
        
        // Intelligent fallback for unmatched queries
        if (lowerText.length < 3) return "Please ask a longer question about Mehrab.";
        
        // Generic but helpful fallback
        return `I can help with questions about Mehrab's projects, skills (Python, Django, IoT, C++, React), experience, education, publications, or contact information. What would you like to know?`