// PSLaw Chat Widget - Bootstrap and Implementation
(function() {
  'use strict';

  // Global namespace
  window.pslawChat = window.pslawChat || {};

  // Configuration
  const CONFIG = {
    apiEndpoint: '/api/chat',
    calendlyEndpoint: '/api/calendly-slots',
    intakeWebhookEndpoint: '/api/intake-webhook',
    knowledgeFile: '/data/knowledge.json',
    maxMessages: 10,
    suggestions: [
      'Book A Free Consultation',
      'How Do I Pay My Bill?',
      'What Legal Services Do You Offer?',
      'Where Are You Located?'
    ]
  };

  // State management
  let state = {
    isOpen: false,
    messages: [],
    isTyping: false,
    knowledge: null,
    currentController: null
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    // Check for existing elements to avoid conflicts
    detectConflicts();
    
    // Create root container
    createRootContainer();
    
    // Load CSS if not already loaded
    loadStyles();
    
    // Create chat components
    createFloatingButton();
    createModal();
    
    // Load saved messages from sessionStorage
    loadSavedMessages();
    
    // Dispatch init event
    dispatchChatEvent('init');
  }

  function detectConflicts() {
    // Check for bottom-right fixed elements
    const elements = document.querySelectorAll('*');
    let offset = 0;
    
    elements.forEach(el => {
      const styles = window.getComputedStyle(el);
      if (styles.position === 'fixed') {
        const rect = el.getBoundingClientRect();
        const bottom = window.innerHeight - rect.bottom;
        const right = window.innerWidth - rect.right;
        
        if (bottom < 100 && right < 100 && el.id !== 'pslaw-chat-fab') {
          // Found potential conflict
          offset = Math.max(offset, 80 - bottom);
        }
      }
    });
    
    if (offset > 0) {
      document.documentElement.style.setProperty('--pslaw-fab-offset', `${offset}px`);
    }
  }

  function createRootContainer() {
    if (document.getElementById('pslaw-root')) return;
    
    const root = document.createElement('div');
    root.id = 'pslaw-root';
    root.setAttribute('data-pslaw-root', '');
    root.setAttribute('hidden', '');
    document.body.appendChild(root);
    
    window.pslawChat.root = root;
  }

  function loadStyles() {
    if (document.querySelector('link[href*="pslaw-chat.css"]')) return;
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/public/pslaw-chat.css';
    document.head.appendChild(link);
  }

  function createFloatingButton() {
    const fab = document.createElement('button');
    fab.id = 'pslaw-chat-fab';
    fab.setAttribute('role', 'button');
    fab.setAttribute('aria-label', 'Open Chat');
    fab.setAttribute('aria-expanded', 'false');
    fab.setAttribute('aria-controls', 'pslaw-chat-modal');
    
    // Try to load PNG image first, fallback to SVG
    const img = new Image();
    img.onload = function() {
      fab.style.backgroundImage = `url('/public/assets/pslaw-chat-icon.png')`;
    };
    img.onerror = function() {
      // Try SVG as fallback
      const svgImg = new Image();
      svgImg.onload = function() {
        fab.style.backgroundImage = `url('/public/assets/pslaw-chat-icon.svg')`;
      };
      svgImg.onerror = function() {
        // Use inline SVG as final fallback
        fab.innerHTML = `
          <div class="pslaw-fab-fallback">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="white"/>
              <text x="16" y="22" text-anchor="middle" font-size="20" font-weight="bold" fill="#ff4900">P</text>
            </svg>
          </div>
        `;
      };
      svgImg.src = '/public/assets/pslaw-chat-icon.svg';
    };
    img.src = '/public/assets/pslaw-chat-icon.png';
    
    fab.addEventListener('click', toggleChat);
    document.body.appendChild(fab);
    
    window.pslawChat.fab = fab;
  }

  function createModal() {
    const root = window.pslawChat.root;
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'pslaw-modal-overlay';
    overlay.addEventListener('click', closeChat);
    
    // Create modal
    const modal = document.createElement('div');
    modal.id = 'pslaw-chat-modal';
    modal.className = 'pslaw-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'pslaw-modal-title');
    
    modal.innerHTML = `
      <div class="pslaw-modal-header">
        <h2 id="pslaw-modal-title" class="pslaw-modal-title">Law Offices of Pritpal Singh</h2>
        <button class="pslaw-modal-close" aria-label="Close chat">&times;</button>
      </div>
      
      <div class="pslaw-suggestions">
        ${CONFIG.suggestions.map(s => `<button class="pslaw-chip" data-suggestion="${s}">${s}</button>`).join('')}
      </div>
      
      <div class="pslaw-messages" id="pslaw-messages"></div>
      
      <div class="pslaw-quick-actions">
        <a href="/client-area/intake-form" class="pslaw-quick-action" target="_blank">Consultation</a>
        <a href="/pay-my-bill" class="pslaw-quick-action" target="_blank">Pay Bill</a>
        <a href="/services" class="pslaw-quick-action" target="_blank">Services</a>
        <a href="/contact" class="pslaw-quick-action" target="_blank">Contact</a>
      </div>
      
      <div class="pslaw-input-container">
        <textarea 
          class="pslaw-input" 
          id="pslaw-input"
          placeholder="Type your message..."
          aria-label="Type your message"
          rows="1"
        ></textarea>
        <button class="pslaw-send-btn" id="pslaw-send" aria-label="Send message">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      
      <div class="pslaw-footer">
        General information only. No attorney–client relationship is formed through this chat.
      </div>
    `;
    
    root.appendChild(overlay);
    root.appendChild(modal);
    
    // Attach event listeners
    modal.querySelector('.pslaw-modal-close').addEventListener('click', closeChat);
    modal.querySelector('#pslaw-send').addEventListener('click', sendMessage);
    modal.querySelector('#pslaw-input').addEventListener('keypress', handleInputKeypress);
    
    // Suggestion chips
    modal.querySelectorAll('.pslaw-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const suggestion = chip.getAttribute('data-suggestion');
        handleSuggestion(suggestion);
      });
    });
    
    // Auto-resize textarea
    const textarea = modal.querySelector('#pslaw-input');
    textarea.addEventListener('input', () => {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    });
    
    window.pslawChat.modal = modal;
    window.pslawChat.overlay = overlay;
  }

  function toggleChat() {
    state.isOpen ? closeChat() : openChat();
  }

  function openChat() {
    state.isOpen = true;
    const root = window.pslawChat.root;
    const fab = window.pslawChat.fab;
    const modal = window.pslawChat.modal;
    const overlay = window.pslawChat.overlay;
    
    root.removeAttribute('hidden');
    overlay.classList.add('pslaw-active');
    modal.classList.add('pslaw-active');
    fab.setAttribute('aria-expanded', 'true');
    
    // Focus trap
    modal.querySelector('#pslaw-input').focus();
    
    // Load knowledge base if not loaded
    if (!state.knowledge) {
      loadKnowledge();
    }
    
    // Show welcome message if no messages
    if (state.messages.length === 0) {
      addMessage('assistant', 'Hello! I\'m here to help with general information about our real estate law services. How can I assist you today?');
    }
    
    dispatchChatEvent('open');
  }

  function closeChat() {
    state.isOpen = false;
    const root = window.pslawChat.root;
    const fab = window.pslawChat.fab;
    const modal = window.pslawChat.modal;
    const overlay = window.pslawChat.overlay;
    
    overlay.classList.remove('pslaw-active');
    modal.classList.remove('pslaw-active');
    
    setTimeout(() => {
      root.setAttribute('hidden', '');
    }, 300);
    
    fab.setAttribute('aria-expanded', 'false');
    fab.focus();
    
    dispatchChatEvent('close');
  }

  function handleInputKeypress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function handleSuggestion(suggestion) {
    const input = document.querySelector('#pslaw-input');
    input.value = suggestion;
    
    // Special handling for consultation booking
    if (suggestion === 'Book A Free Consultation') {
      sendMessage();
      // Automatically trigger Calendly check
      setTimeout(() => {
        handleCalendlyBooking();
      }, 2000);
    } else {
      sendMessage();
    }
  }
  
  async function handleCalendlyBooking() {
    showTypingIndicator();
    
    try {
      const response = await fetch(CONFIG.calendlyEndpoint);
      const data = await response.json();
      
      hideTypingIndicator();
      
      if (data.available && data.bookingUrl) {
        const messagesEl = document.querySelector('#pslaw-messages');
        const messageEl = document.createElement('div');
        messageEl.className = 'pslaw-message pslaw-assistant';
        
        let html = '<div class="pslaw-message-bubble">';
        html += '<strong>Schedule Your Free Consultation</strong><br><br>';
        
        if (data.eventType) {
          html += `${data.message}<br><br>`;
          if (data.instructions) {
            html += `${data.instructions}<br><br>`;
          }
        }
        
        html += `<a href="${data.bookingUrl}" target="_blank" style="display: inline-block; padding: 10px 20px; background: var(--pslaw-navy); color: white; text-decoration: none; border-radius: 4px; font-weight: 500;">📅 Open Calendly Scheduler</a>`;
        html += '</div>';
        
        messageEl.innerHTML = html;
        messagesEl.appendChild(messageEl);
        messagesEl.scrollTop = messagesEl.scrollHeight;
      }
    } catch (error) {
      hideTypingIndicator();
      console.error('Calendly booking error:', error);
    }
  }

  async function sendMessage() {
    const input = document.querySelector('#pslaw-input');
    const sendBtn = document.querySelector('#pslaw-send');
    const message = input.value.trim();
    
    if (!message || state.isTyping) return;
    
    // Add user message
    addMessage('user', message);
    
    // Clear input
    input.value = '';
    input.style.height = 'auto';
    
    // Disable input while processing
    input.disabled = true;
    sendBtn.disabled = true;
    state.isTyping = true;
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
      // Cancel previous request if any
      if (state.currentController) {
        state.currentController.abort();
      }
      
      state.currentController = new AbortController();
      
      // Prepare context from knowledge base
      const context = await getRelevantContext(message);
      
      // Prepare messages for API
      const apiMessages = state.messages.slice(-10).map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      }));
      
      // Add context if available
      if (context) {
        apiMessages.unshift({
          role: 'system',
          content: `Relevant information from website:\n${context}`
        });
      }
      
      // Make API call
      const response = await fetch(CONFIG.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: apiMessages }),
        signal: state.currentController.signal
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response');
      }
      
      // Handle streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';
      
      hideTypingIndicator();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              continue;
            }
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.choices?.[0]?.delta?.content) {
                assistantMessage += parsed.choices[0].delta.content;
                updateLastMessage(assistantMessage);
              }
              // Handle tool calls
              if (parsed.choices?.[0]?.delta?.tool_calls) {
                handleToolCalls(parsed.choices[0].delta.tool_calls);
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
      
      if (assistantMessage) {
        addMessage('assistant', assistantMessage);
      }
      
    } catch (error) {
      hideTypingIndicator();
      if (error.name !== 'AbortError') {
        showError('Sorry, I encountered an error. Please try again.');
        console.error('Chat error:', error);
      }
    } finally {
      input.disabled = false;
      sendBtn.disabled = false;
      state.isTyping = false;
      state.currentController = null;
    }
    
    dispatchChatEvent('send', { message });
  }

  function addMessage(role, content) {
    const message = { role, content, timestamp: Date.now() };
    state.messages.push(message);
    
    const messagesEl = document.querySelector('#pslaw-messages');
    const messageEl = document.createElement('div');
    messageEl.className = `pslaw-message pslaw-${role}`;
    
    const bubble = document.createElement('div');
    bubble.className = 'pslaw-message-bubble';
    bubble.textContent = content;
    
    messageEl.appendChild(bubble);
    messagesEl.appendChild(messageEl);
    
    // Scroll to bottom
    messagesEl.scrollTop = messagesEl.scrollHeight;
    
    // Save messages
    saveMessages();
  }

  function updateLastMessage(content) {
    const messagesEl = document.querySelector('#pslaw-messages');
    let lastAssistant = messagesEl.querySelector('.pslaw-assistant:last-child .pslaw-message-bubble');
    
    if (!lastAssistant) {
      // Create new assistant message
      const messageEl = document.createElement('div');
      messageEl.className = 'pslaw-message pslaw-assistant';
      
      const bubble = document.createElement('div');
      bubble.className = 'pslaw-message-bubble';
      
      messageEl.appendChild(bubble);
      messagesEl.appendChild(messageEl);
      lastAssistant = bubble;
    }
    
    lastAssistant.textContent = content;
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function showTypingIndicator() {
    const messagesEl = document.querySelector('#pslaw-messages');
    const typing = document.createElement('div');
    typing.className = 'pslaw-message pslaw-assistant';
    typing.id = 'pslaw-typing';
    typing.innerHTML = `
      <div class="pslaw-typing">
        <div class="pslaw-typing-dot"></div>
        <div class="pslaw-typing-dot"></div>
        <div class="pslaw-typing-dot"></div>
      </div>
    `;
    messagesEl.appendChild(typing);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function hideTypingIndicator() {
    const typing = document.querySelector('#pslaw-typing');
    if (typing) typing.remove();
  }

  function showError(message) {
    const messagesEl = document.querySelector('#pslaw-messages');
    const error = document.createElement('div');
    error.className = 'pslaw-error';
    error.innerHTML = `
      ${message}
      <button class="pslaw-retry-btn" onclick="window.pslawChat.retry()">Retry</button>
    `;
    messagesEl.appendChild(error);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  async function loadKnowledge() {
    try {
      const response = await fetch(CONFIG.knowledgeFile);
      if (response.ok) {
        state.knowledge = await response.json();
        // Cache in localStorage
        localStorage.setItem('pslaw-knowledge', JSON.stringify(state.knowledge));
      }
    } catch (error) {
      // Try to load from cache
      const cached = localStorage.getItem('pslaw-knowledge');
      if (cached) {
        state.knowledge = JSON.parse(cached);
      }
    }
  }

  async function getRelevantContext(query) {
    if (!state.knowledge || !state.knowledge.pages) return null;
    
    // Simple keyword matching (can be improved with proper search)
    const keywords = query.toLowerCase().split(/\s+/);
    const scores = state.knowledge.pages.map(page => {
      const text = (page.title + ' ' + page.text).toLowerCase();
      const score = keywords.reduce((sum, keyword) => {
        return sum + (text.includes(keyword) ? 1 : 0);
      }, 0);
      return { page, score };
    });
    
    // Get top 3 relevant pages
    const relevant = scores
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(s => `${s.page.title}: ${s.page.text.substring(0, 200)}...`);
    
    return relevant.length > 0 ? relevant.join('\n\n') : null;
  }

  async function handleToolCalls(toolCalls) {
    for (const tool of toolCalls) {
      if (tool.function.name === 'book_consultation') {
        // Handle consultation booking
        showTypingIndicator();
        
        try {
          const response = await fetch(CONFIG.calendlyEndpoint);
          const data = await response.json();
          
          hideTypingIndicator();
          
          if (data.available) {
            let messageHtml = '';
            
            if (data.eventType) {
              messageHtml += `<strong>${data.eventType.name}</strong>`;
              if (data.eventType.duration) {
                messageHtml += ` (${data.eventType.duration} minutes)`;
              }
              messageHtml += '<br><br>';
            }
            
            if (data.message) {
              messageHtml += `${data.message}<br>`;
            }
            
            if (data.instructions) {
              messageHtml += `${data.instructions}<br><br>`;
            }
            
            if (data.bookingUrl) {
              messageHtml += `<a href="${data.bookingUrl}" target="_blank" style="display: inline-block; margin-top: 10px; padding: 10px 20px; background: var(--pslaw-navy); color: white; text-decoration: none; border-radius: 4px; font-weight: 500;">📅 View Available Times & Book</a>`;
            }
            
            // Add message with HTML content
            const messagesEl = document.querySelector('#pslaw-messages');
            const messageEl = document.createElement('div');
            messageEl.className = 'pslaw-message pslaw-assistant';
            
            const bubble = document.createElement('div');
            bubble.className = 'pslaw-message-bubble';
            bubble.innerHTML = messageHtml;
            
            messageEl.appendChild(bubble);
            messagesEl.appendChild(messageEl);
            messagesEl.scrollTop = messagesEl.scrollHeight;
            
            // Save to state
            state.messages.push({ 
              role: 'assistant', 
              content: data.message || 'Consultation booking available',
              timestamp: Date.now() 
            });
            saveMessages();
          } else {
            addMessage('assistant', data.message || 'Please call (510) 443-2123 or use our online intake form to schedule a consultation.');
            
            if (data.fallbackUrl) {
              // Add a button for the intake form
              const messagesEl = document.querySelector('#pslaw-messages');
              const lastMessage = messagesEl.lastElementChild.querySelector('.pslaw-message-bubble');
              lastMessage.innerHTML += `<br><a href="${data.fallbackUrl}" target="_blank" style="display: inline-block; margin-top: 10px; padding: 8px 16px; background: var(--pslaw-primary); color: white; text-decoration: none; border-radius: 4px;">Fill Intake Form</a>`;
            }
          }
        } catch (error) {
          hideTypingIndicator();
          console.error('Calendly error:', error);
          addMessage('assistant', 'I apologize, but I encountered an error accessing the scheduling system. Please call (510) 443-2123 to schedule your consultation.');
        }
        
        dispatchChatEvent('tool', { tool: 'book_consultation' });
      } else if (tool.function.name === 'intake_webhook') {
        // Handle intake webhook
        const args = JSON.parse(tool.function.arguments);
        
        try {
          const response = await fetch(CONFIG.intakeWebhookEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...args,
              transcript: state.messages
            })
          });
          
          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              addMessage('assistant', 'Thank you! Your information has been received. Our team will contact you shortly.');
            }
          }
        } catch (error) {
          console.error('Intake webhook error:', error);
        }
        
        dispatchChatEvent('tool', { tool: 'intake_webhook' });
      }
    }
  }

  function saveMessages() {
    const toSave = state.messages.slice(-CONFIG.maxMessages);
    sessionStorage.setItem('pslaw-messages', JSON.stringify(toSave));
  }

  function loadSavedMessages() {
    const saved = sessionStorage.getItem('pslaw-messages');
    if (saved) {
      try {
        state.messages = JSON.parse(saved);
        // Don't render old messages, just keep in state
      } catch (e) {
        // Invalid data
      }
    }
  }

  function dispatchChatEvent(type, detail = {}) {
    window.dispatchEvent(new CustomEvent('pslaw:chat', {
      detail: { type, ...detail }
    }));
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.isOpen) {
      closeChat();
    }
  });

  // Public API
  window.pslawChat.open = openChat;
  window.pslawChat.close = closeChat;
  window.pslawChat.send = (message) => {
    const input = document.querySelector('#pslaw-input');
    input.value = message;
    sendMessage();
  };
  window.pslawChat.retry = () => {
    const messagesEl = document.querySelector('#pslaw-messages');
    const errors = messagesEl.querySelectorAll('.pslaw-error');
    errors.forEach(e => e.remove());
    
    // Resend last user message
    const lastUserMessage = [...state.messages].reverse().find(m => m.role === 'user');
    if (lastUserMessage) {
      const input = document.querySelector('#pslaw-input');
      input.value = lastUserMessage.content;
      sendMessage();
    }
  };

})();