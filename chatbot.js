/**
 * PritAI Chatbot - Law Offices of Pritpal Singh, PC
 * AI-powered virtual assistant for client intake and support
 */

class PritAIChatbot {
    constructor() {
        this.isOpen = false;
        this.conversation = [];
        this.userInfo = {};
        this.hasExpanded = false;
        this.isTyping = false;
        
        this.init();
        this.setupAutoExpand();
    }

    init() {
        this.createChatbotHTML();
        this.bindEvents();
        this.showWelcomeMessage();
    }

    createChatbotHTML() {
        // Create chatbot container
        const chatbotContainer = document.createElement('div');
        chatbotContainer.id = 'pritai-chatbot';
        chatbotContainer.innerHTML = `
            <!-- Floating Button -->
            <div id="pritai-button" class="pritai-floating-btn">
                <img src="/pritai_1756438925507.png" alt="PritAI Assistant" class="pritai-icon">
                <div class="pritai-notification-dot" id="pritai-notification"></div>
            </div>

            <!-- Chat Window -->
            <div id="pritai-chat-window" class="pritai-chat-window">
                <div class="pritai-header">
                    <div class="pritai-header-content">
                        <img src="/pritai_1756438925507.png" alt="PritAI" class="pritai-header-icon">
                        <div class="pritai-header-text">
                            <h3>PritAI Assistant</h3>
                            <p>California Real Estate Law Help</p>
                        </div>
                    </div>
                    <button id="pritai-close" class="pritai-close-btn">&times;</button>
                </div>

                <div class="pritai-chat-body" id="pritai-chat-body">
                    <div class="pritai-welcome-message">
                        <div class="pritai-avatar">
                            <img src="/pritai_1756438925507.png" alt="PritAI">
                        </div>
                        <div class="pritai-message-content">
                            <p>👋 Hello! I'm PritAI, your virtual assistant for the Law Offices of Pritpal Singh, PC.</p>
                            <p>I can help you with:</p>
                            <ul>
                                <li>🏡 California real estate law questions</li>
                                <li>📅 Scheduling consultations</li>
                                <li>📋 Client intake and case evaluation</li>
                                <li>💳 Billing and payment assistance</li>
                            </ul>
                            <p>How can I assist you today?</p>
                        </div>
                    </div>

                    <!-- Suggested Questions -->
                    <div class="pritai-suggestions" id="pritai-suggestions">
                        <div class="pritai-suggestion-item" data-question="I need help with a landlord/tenant dispute">
                            🏠 Landlord/Tenant Issues
                        </div>
                        <div class="pritai-suggestion-item" data-question="I'm buying/selling property and need legal help">
                            🏡 Property Transactions
                        </div>
                        <div class="pritai-suggestion-item" data-question="I have a property title or boundary dispute">
                            📋 Title & Boundary Issues
                        </div>
                        <div class="pritai-suggestion-item" data-question="I want to schedule a consultation with the attorney">
                            📅 Schedule Consultation
                        </div>
                        <div class="pritai-suggestion-item" data-question="Tell me about Pritpal Singh's qualifications">
                            👨‍💼 About the Attorney
                        </div>
                        <div class="pritai-suggestion-item" data-question="What are your legal fees and consultation costs?">
                            💰 Fees & Billing
                        </div>
                    </div>
                </div>

                <div class="pritai-chat-input">
                    <div class="pritai-typing-indicator" id="pritai-typing" style="display: none;">
                        <span></span>
                        <span></span>
                        <span></span>
                        PritAI is typing...
                    </div>
                    <div class="pritai-input-container">
                        <input type="text" id="pritai-message-input" placeholder="Type your message here..." autocomplete="off">
                        <button id="pritai-send-btn" class="pritai-send-btn">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(chatbotContainer);
    }

    bindEvents() {
        // Floating button click
        document.getElementById('pritai-button').addEventListener('click', () => {
            this.toggleChat();
        });

        // Close button click
        document.getElementById('pritai-close').addEventListener('click', () => {
            this.closeChat();
        });

        // Send button click
        document.getElementById('pritai-send-btn').addEventListener('click', () => {
            this.sendMessage();
        });

        // Enter key in input
        document.getElementById('pritai-message-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Suggestion clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('pritai-suggestion-item')) {
                const question = e.target.getAttribute('data-question');
                this.sendSuggestedQuestion(question);
            }
        });

        // Close chat when clicking outside
        document.addEventListener('click', (e) => {
            const chatWindow = document.getElementById('pritai-chat-window');
            const floatingBtn = document.getElementById('pritai-button');
            
            if (this.isOpen && !chatWindow.contains(e.target) && !floatingBtn.contains(e.target)) {
                this.closeChat();
            }
        });
    }

    setupAutoExpand() {
        // Auto-expand after 15 seconds
        setTimeout(() => {
            if (!this.hasExpanded && !this.isOpen) {
                this.showNotification();
                
                // Auto-open after showing notification for 3 seconds
                setTimeout(() => {
                    if (!this.isOpen) {
                        this.openChat();
                        this.hasExpanded = true;
                    }
                }, 3000);
            }
        }, 15000);
    }

    showNotification() {
        const notification = document.getElementById('pritai-notification');
        notification.style.display = 'block';
        
        // Pulse animation
        notification.style.animation = 'pritai-pulse 2s infinite';
    }

    hideNotification() {
        const notification = document.getElementById('pritai-notification');
        notification.style.display = 'none';
    }

    showWelcomeMessage() {
        // This is handled in the HTML, but we can add dynamic welcome messages here
        const currentHour = new Date().getHours();
        let greeting = "Hello!";
        
        if (currentHour < 12) {
            greeting = "Good morning!";
        } else if (currentHour < 17) {
            greeting = "Good afternoon!";
        } else {
            greeting = "Good evening!";
        }

        // Could update the welcome message dynamically
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        this.isOpen = true;
        this.hideNotification();
        
        const chatWindow = document.getElementById('pritai-chat-window');
        const floatingBtn = document.getElementById('pritai-button');
        
        chatWindow.style.display = 'flex';
        setTimeout(() => {
            chatWindow.classList.add('pritai-open');
            floatingBtn.classList.add('pritai-hidden');
        }, 10);

        // Focus input
        setTimeout(() => {
            document.getElementById('pritai-message-input').focus();
        }, 300);
    }

    closeChat() {
        this.isOpen = false;
        
        const chatWindow = document.getElementById('pritai-chat-window');
        const floatingBtn = document.getElementById('pritai-button');
        
        chatWindow.classList.remove('pritai-open');
        floatingBtn.classList.remove('pritai-hidden');
        
        setTimeout(() => {
            chatWindow.style.display = 'none';
        }, 300);
    }

    async sendMessage() {
        const input = document.getElementById('pritai-message-input');
        const message = input.value.trim();
        
        if (!message) return;

        // Clear input
        input.value = '';

        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Hide suggestions after first message
        this.hideSuggestions();

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Send to backend
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    conversation: this.conversation
                })
            });

            const data = await response.json();

            // Hide typing indicator
            this.hideTypingIndicator();

            if (data.success) {
                // Add bot response
                this.addMessage(data.response, 'bot');
                
                // Update conversation history
                this.conversation.push(
                    { role: 'user', content: message },
                    { role: 'assistant', content: data.response }
                );
            } else {
                this.addMessage(data.error || 'Sorry, I encountered an error. Please try again.', 'bot', true);
            }

        } catch (error) {
            console.error('Chat error:', error);
            this.hideTypingIndicator();
            this.addMessage('Sorry, I encountered an error. Please try again or contact our office directly at (510) 225-9220.', 'bot', true);
        }
    }

    sendSuggestedQuestion(question) {
        const input = document.getElementById('pritai-message-input');
        input.value = question;
        this.sendMessage();
    }

    addMessage(content, sender, isError = false) {
        const chatBody = document.getElementById('pritai-chat-body');
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `pritai-message pritai-${sender}${isError ? ' pritai-error' : ''}`;
        
        if (sender === 'bot') {
            messageDiv.innerHTML = `
                <div class="pritai-avatar">
                    <img src="/pritai_1756438925507.png" alt="PritAI">
                </div>
                <div class="pritai-message-content">
                    ${this.formatMessage(content)}
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="pritai-message-content">
                    ${this.formatMessage(content)}
                </div>
            `;
        }

        chatBody.appendChild(messageDiv);
        
        // Scroll to bottom
        chatBody.scrollTop = chatBody.scrollHeight;

        // Animation
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            messageDiv.style.transition = 'all 0.3s ease';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 10);
    }

    formatMessage(content) {
        // Convert URLs to clickable links
        content = content.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
        
        // Convert line breaks to <br>
        content = content.replace(/\n/g, '<br>');
        
        return content;
    }

    hideSuggestions() {
        const suggestions = document.getElementById('pritai-suggestions');
        suggestions.style.display = 'none';
    }

    showTypingIndicator() {
        this.isTyping = true;
        const typingIndicator = document.getElementById('pritai-typing');
        typingIndicator.style.display = 'flex';
        
        // Scroll to bottom
        const chatBody = document.getElementById('pritai-chat-body');
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    hideTypingIndicator() {
        this.isTyping = false;
        const typingIndicator = document.getElementById('pritai-typing');
        typingIndicator.style.display = 'none';
    }
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PritAIChatbot();
});

// Export for potential use in other scripts
window.PritAIChatbot = PritAIChatbot;