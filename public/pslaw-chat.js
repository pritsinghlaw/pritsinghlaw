// PSLaw Chat Widget - Bootstrap and Implementation
(function() {
  'use strict';

  // Global namespace
  window.pslawChat = window.pslawChat || {};

  // Configuration
  const CONFIG = {
    apiEndpoint: '/api/chat',
    // NOTE: This endpoint is no longer used by the booking logic below,
    // as we are now calling the Calendly API directly from the client.
    calendlyEndpoint: '/api/calendly-slots',
    // NEW: Add your Calendly Personal Access Token here.
    // WARNING: For security, it is highly recommended to move this to a secure backend
    // and create an endpoint that proxies the request to the Calendly API.
    // Exposing this token in client-side code is a security risk.
    calendlyAccessToken: 'eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzU1NTMzNDAxLCJqdGkiOiI5ODFjODM5Zi0yOGEwLTRlNjItYmQzYS1kYTE1MzU4NDhjMDkiLCJ1c2VyX3V1aWQiOiJmNGFiNGM3Yy0wZGY2LTRjMWUtYjE3ZC1kYmU5YmVkZjMwMTYifQ.DofhJDS_WNqrl5A_0ryLmApxTtWNIjCpyWPI14WbdfIkCsT_QAZRgG4GdvbxBXTgopUkjsko8d6iKb9nVSebRQ',
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
    detectConflicts();
    createRootContainer();
    loadStyles();
    createFloatingButton();
    createModal();
    loadSavedMessages();
    dispatchChatEvent('init');
  }

  function detectConflicts() {
    const elements = document.querySelectorAll('*');
    let offset = 0;
    elements.forEach(el => {
      const styles = window.getComputedStyle(el);
      if (styles.position === 'fixed') {
        const rect = el.getBoundingClientRect();
        const bottom = window.innerHeight - rect.bottom;
        const right = window.innerWidth - rect.right;
        if (bottom < 100 && right < 100 && el.id !== 'pslaw-chat-fab') {
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

    // NEW: Add styles for Calendly buttons directly into the document head
    // This ensures the buttons look good without needing to modify external CSS files.
    const style = document.createElement('style');
    style.textContent = `
        .pslaw-calendly-button {
            display: block;
            margin-top: 10px;
            padding: 10px 15px;
            background: var(--pslaw-navy, #1a237e);
            color: white !important;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            text-align: center;
            transition: background-color 0.2s;
        }
        .pslaw-calendly-button:hover {
            background: var(--pslaw-navy-dark, #0f174d);
        }
    `;
    document.head.appendChild(style);
  }

  function createFloatingButton() {
    const fab = document.createElement('button');
    fab.id = 'pslaw-chat-fab';
    fab.setAttribute('role', 'button');
    fab.setAttribute('aria-label', 'Open Chat');
    fab.setAttribute('aria-expanded', 'false');
    fab.setAttribute('aria-controls', 'pslaw-chat-modal');
    
    const img = new Image();
    img.onload = () => { fab.style.backgroundImage = `url('/public/assets/pslaw-chat-icon.png')`; };
    img.onerror = () => {
      const svgImg = new Image();
      svgImg.onload = () => { fab.style.backgroundImage = `url('/public/assets/pslaw-chat-icon.svg')`; };
      svgImg.onerror = () => {
        fab.innerHTML = `<div class="pslaw-fab-fallback"><svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="8" fill="white"/><text x="16" y="22" text-anchor="middle" font-size="20" font-weight="bold" fill="#ff4900">P</text></svg></div>`;
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
    const overlay = document.createElement('div');
    overlay.className = 'pslaw-modal-overlay';
    overlay.addEventListener('click', closeChat);
    
    const modal = document.createElement('div');
    modal.id = 'pslaw-chat-modal';
    modal.className = 'pslaw-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'pslaw-modal-title');
    
    modal.innerHTML = `
      <div class="pslaw-modal-header">
        <span><img src="/icon.png" width="24" height="auto"/></span><h2 id="pslaw-modal-title" class="pslaw-modal-title">  AI Legal Assistance</h2> 
        <br>
         <span class="pslaw-status">Online</span>
        <button class="pslaw-modal-close" aria-label="Close chat">&times;</button>
      </div>
      <div class="pslaw-suggestions">${CONFIG.suggestions.map(s => `<button class="pslaw-chip" data-suggestion="${s}">${s}</button>`).join('')}</div>
      <div class="pslaw-messages" id="pslaw-messages"></div>
      <div class="pslaw-quick-actions">
        <a href="/client-area/intake-form" class="pslaw-quick-action" target="_blank">Consultation</a>
        <a href="/pay-my-bill" class="pslaw-quick-action" target="_blank">Pay Bill</a>
        <a href="/services" class="pslaw-quick-action" target="_blank">Services</a>
        <a href="/contact" class="pslaw-quick-action" target="_blank">Contact</a>
      </div>
      <div class="pslaw-input-container">
        <textarea class="pslaw-input" id="pslaw-input" placeholder="Type your message..." aria-label="Type your message" rows="1"></textarea>
        <button class="pslaw-send-btn" id="pslaw-send" aria-label="Send message"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      </div>
      <div class="pslaw-footer">General information only. No attorney–client relationship is formed through this chat.</div>
    `;
    
    root.appendChild(overlay);
    root.appendChild(modal);
    
    modal.querySelector('.pslaw-modal-close').addEventListener('click', closeChat);
    modal.querySelector('#pslaw-send').addEventListener('click', sendMessage);
    modal.querySelector('#pslaw-input').addEventListener('keypress', handleInputKeypress);
    modal.querySelectorAll('.pslaw-chip').forEach(chip => {
      chip.addEventListener('click', () => handleSuggestion(chip.getAttribute('data-suggestion')));
    });
    
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
    const { root, fab, modal, overlay } = window.pslawChat;
    root.removeAttribute('hidden');
    overlay.classList.add('pslaw-active');
    modal.classList.add('pslaw-active');
    fab.setAttribute('aria-expanded', 'true');
    modal.querySelector('#pslaw-input').focus();
    if (!state.knowledge) loadKnowledge();
    if (state.messages.length === 0) {
      addMessage('assistant', 'Hello! I\'m here to help with general information about our real estate law services. How can I assist you today?');
    }
    dispatchChatEvent('open');
  }

  function closeChat() {
    state.isOpen = false;
    const { root, fab, modal, overlay } = window.pslawChat;
    overlay.classList.remove('pslaw-active');
    modal.classList.remove('pslaw-active');
    setTimeout(() => root.setAttribute('hidden', ''), 300);
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

  // MODIFIED: This function now calls the new dynamic Calendly logic.
  function handleSuggestion(suggestion) {
    const input = document.querySelector('#pslaw-input');
    input.value = suggestion;
    
    if (suggestion === 'Book A Free Consultation') {
      // Add the user's click as a message in the chat for context.
      addMessage('user', suggestion);
      input.value = ''; // Clear the input field.
      // Call the new function to fetch and display Calendly links.
      displayCalendlyOptions();
    } else {
      sendMessage();
    }
  }
  
  // REMOVED: The old `handleCalendlyBooking` function is no longer needed
  // as its logic has been replaced by `displayCalendlyOptions`.

  // NEW: This function fetches and displays booking links directly from the Calendly API.
  async function displayCalendlyOptions() {
    showTypingIndicator();
    const token = CONFIG.calendlyAccessToken;

    if (!token || token.includes('eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzU1NTMzNDAxLCJqdGkiOiI5ODFjODM5Zi0yOGEwLTRlNjItYmQzYS1kYTE1MzU4NDhjMDkiLCJ1c2VyX3V1aWQiOiJmNGFiNGM3Yy0wZGY2LTRjMWUtYjE3ZC1kYmU5YmVkZjMwMTYifQ.DofhJDS_WNqrl5A_0ryLmApxTtWNIjCpyWPI14WbdfIkCsT_QAZRgG4GdvbxBXTgopUkjsko8d6iKb9nVSebRQ')) {
        hideTypingIndicator();
        addMessage('assistant', 'The scheduling feature is not configured correctly. Please contact us directly to book an appointment.');
        console.error('Calendly Access Token is missing or is a placeholder.');
        return;
    }

    try {
        // Step 1: Fetch the user's information to get their unique URI.
        const userResponse = await fetch('https://api.calendly.com/users/me', {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        if (!userResponse.ok) throw new Error(`Calendly authentication failed. Status: ${userResponse.status}`);
        const userData = await userResponse.json();
        const userUri = userData.resource.uri;

        // Step 2: Use the user's URI to fetch their active event types (booking links).
        const eventsResponse = await fetch(`https://api.calendly.com/event_types?user=${userUri}&active=true`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        if (!eventsResponse.ok) throw new Error('Could not fetch booking links from Calendly.');
        const eventsData = await eventsResponse.json();
        
        hideTypingIndicator();

        const activeEvents = eventsData.collection;
        if (activeEvents.length === 0) {
            addMessage('assistant', 'It seems there are no appointments available right now. Please try again later or contact us directly at (510) 443-2123.');
            return;
        }

        // Step 3: Find the specific booking links mentioned in the prompt.
        const freeConsultation = activeEvents.find(e => e.name.toLowerCase().includes('free'));
        const paidConsultation = activeEvents.find(e => e.name.toLowerCase().includes('paid'));

        // Step 4: Create a message with buttons for the found booking links.
        const messagesEl = document.querySelector('#pslaw-messages');
        const messageEl = document.createElement('div');
        messageEl.className = 'pslaw-message pslaw-assistant';
        
        let html = '<div class="pslaw-message-bubble">';
        html += '<strong>Ready to schedule?</strong><br>Please choose a consultation type below:';
        
        if (freeConsultation) {
            html += `<a href="${freeConsultation.scheduling_url}" target="_blank" class="pslaw-calendly-button">📅 ${freeConsultation.name}</a>`;
        }
        if (paidConsultation) {
            html += `<a href="${paidConsultation.scheduling_url}" target="_blank" class="pslaw-calendly-button">📅 ${paidConsultation.name}</a>`;
        }
        
        // Fallback if the specific links aren't found
        if (!freeConsultation && !paidConsultation) {
           html += '<br><br>I couldn\'t find the specific consultation links, but here are other available options:';
           activeEvents.slice(0, 3).forEach(event => {
              html += `<a href="${event.scheduling_url}" target="_blank" class="pslaw-calendly-button">📅 ${event.name} (${event.duration} min)</a>`;
           });
        }

        html += '</div>';
        messageEl.innerHTML = html;
        messagesEl.appendChild(messageEl);
        messagesEl.scrollTop = messagesEl.scrollHeight;

    } catch (error) {
        hideTypingIndicator();
        console.error('Calendly API Error:', error);
        addMessage('assistant', 'I apologize, but I\'m having trouble connecting to our scheduling system. Please call (510) 443-2123 to book an appointment.');
    }
  }

  async function sendMessage() {
    const input = document.querySelector('#pslaw-input');
    const sendBtn = document.querySelector('#pslaw-send');
    const message = input.value.trim();
    if (!message || state.isTyping) return;

    addMessage('user', message);
    input.value = '';
    input.style.height = 'auto';
    input.disabled = true;
    sendBtn.disabled = true;
    state.isTyping = true;
    showTypingIndicator();
    
    try {
      if (state.currentController) state.currentController.abort();
      state.currentController = new AbortController();
      
      const context = await getRelevantContext(message);
      const apiMessages = state.messages.slice(-10).map(m => ({ role: m.role, content: m.content }));
      if (context) {
        apiMessages.unshift({ role: 'system', content: `Relevant information from website:\n${context}` });
      }
      
      const response = await fetch(CONFIG.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
        signal: state.currentController.signal
      });
      if (!response.ok) throw new Error('Failed to get response');
      
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
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.choices?.[0]?.delta?.content) {
                assistantMessage += parsed.choices[0].delta.content;
                updateLastMessage(assistantMessage);
              }
              if (parsed.choices?.[0]?.delta?.tool_calls) {
                handleToolCalls(parsed.choices[0].delta.tool_calls);
              }
            } catch (e) { /* Skip invalid JSON */ }
          }
        }
      }
      if (assistantMessage) addMessage('assistant', assistantMessage);
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
    messagesEl.scrollTop = messagesEl.scrollHeight;
    saveMessages();
  }

  function updateLastMessage(content) {
    const messagesEl = document.querySelector('#pslaw-messages');
    let lastAssistant = messagesEl.querySelector('.pslaw-assistant:last-child .pslaw-message-bubble');
    if (!lastAssistant) {
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
    if (document.getElementById('pslaw-typing')) return;
    const typing = document.createElement('div');
    typing.className = 'pslaw-message pslaw-assistant';
    typing.id = 'pslaw-typing';
    typing.innerHTML = `<div class="pslaw-typing"><div class="pslaw-typing-dot"></div><div class="pslaw-typing-dot"></div><div class="pslaw-typing-dot"></div></div>`;
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
    error.innerHTML = `${message} <button class="pslaw-retry-btn" onclick="window.pslawChat.retry()">Retry</button>`;
    messagesEl.appendChild(error);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  async function loadKnowledge() {
    try {
      const response = await fetch(CONFIG.knowledgeFile);
      if (response.ok) {
        state.knowledge = await response.json();
        localStorage.setItem('pslaw-knowledge', JSON.stringify(state.knowledge));
      }
    } catch (error) {
      const cached = localStorage.getItem('pslaw-knowledge');
      if (cached) state.knowledge = JSON.parse(cached);
    }
  }

  async function getRelevantContext(query) {
    if (!state.knowledge || !state.knowledge.pages) return null;
    const keywords = query.toLowerCase().split(/\s+/);
    const scores = state.knowledge.pages.map(page => {
      const text = (page.title + ' ' + page.text).toLowerCase();
      const score = keywords.reduce((sum, keyword) => sum + (text.includes(keyword) ? 1 : 0), 0);
      return { page, score };
    });
    const relevant = scores.filter(s => s.score > 0).sort((a, b) => b.score - a.score).slice(0, 3).map(s => `${s.page.title}: ${s.page.text.substring(0, 200)}...`);
    return relevant.length > 0 ? relevant.join('\n\n') : null;
  }

  // MODIFIED: This function now calls the new dynamic Calendly logic, simplifying the code.
  async function handleToolCalls(toolCalls) {
    for (const tool of toolCalls) {
      if (tool.function.name === 'book_consultation') {
        // Call the same dynamic function used by the suggestion chip.
        await displayCalendlyOptions();
        dispatchChatEvent('tool', { tool: 'book_consultation' });

      } else if (tool.function.name === 'intake_webhook') {
        const args = JSON.parse(tool.function.arguments);
        try {
          const response = await fetch(CONFIG.intakeWebhookEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...args, transcript: state.messages })
          });
          if (response.ok) {
            const result = await response.json();
            if (result.success) addMessage('assistant', 'Thank you! Your information has been received. Our team will contact you shortly.');
          }
        } catch (error) { console.error('Intake webhook error:', error); }
        dispatchChatEvent('tool', { tool: 'intake_webhook' });
      }
    }
  }

  function saveMessages() {
    sessionStorage.setItem('pslaw-messages', JSON.stringify(state.messages.slice(-CONFIG.maxMessages)));
  }

  function loadSavedMessages() {
    const saved = sessionStorage.getItem('pslaw-messages');
    if (saved) {
      try { state.messages = JSON.parse(saved); } catch (e) { /* Invalid data */ }
    }
  }

  function dispatchChatEvent(type, detail = {}) {
    window.dispatchEvent(new CustomEvent('pslaw:chat', { detail: { type, ...detail } }));
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.isOpen) closeChat();
  });

  window.pslawChat.open = openChat;
  window.pslawChat.close = closeChat;
  window.pslawChat.send = (message) => {
    document.querySelector('#pslaw-input').value = message;
    sendMessage();
  };
  window.pslawChat.retry = () => {
    const messagesEl = document.querySelector('#pslaw-messages');
    messagesEl.querySelectorAll('.pslaw-error').forEach(e => e.remove());
    const lastUserMessage = [...state.messages].reverse().find(m => m.role === 'user');
    if (lastUserMessage) {
      document.querySelector('#pslaw-input').value = lastUserMessage.content;
      sendMessage();
    }
  };

})();
