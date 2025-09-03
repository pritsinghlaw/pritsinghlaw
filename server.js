const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// CORS configuration - locked to origin
app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:5000', 'https://pritsinghlaw.com'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// OpenAI chat endpoint with streaming
app.post('/api/chat', async (req, res) => {
  const { messages, tools } = req.body;
  
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }

  // Set up SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  try {
    // Load system instructions
    let systemPrompt = '';
    try {
      const systemInstructions = await fs.readFile('docs/system_instructions.md', 'utf8');
      const trainingScript = await fs.readFile('docs/training_script.md', 'utf8');
      systemPrompt = `${systemInstructions}\n\n--- Additional Training Context ---\n${trainingScript}`;
    } catch (error) {
      console.log('Using default system prompt');
      systemPrompt = `You are the AI assistant for the Law Offices of Pritpal Singh, a California real estate law firm. 
You provide general information only - no legal advice. No attorney-client relationship is formed through this chat.
Direct users to call (510) 443-2123 or book a consultation for specific legal matters.`;
    }

    // Prepare messages with system prompt
    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    // Determine model to use
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    console.log(`Using model: ${model}`);

    // Make OpenAI API call
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: model,
        messages: apiMessages,
        temperature: 0.4,
        max_tokens: 1500,
        stream: true,
        tools: tools || [
          {
            type: 'function',
            function: {
              name: 'book_consultation',
              description: 'Help user book a free consultation',
              parameters: {
                type: 'object',
                properties: {
                  preferred_time: { type: 'string', description: 'Preferred consultation time' }
                }
              }
            }
          },
          {
            type: 'function',
            function: {
              name: 'intake_webhook',
              description: 'Send intake information to Zapier',
              parameters: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string' },
                  phone: { type: 'string' },
                  issue: { type: 'string' }
                }
              }
            }
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    // Stream the response
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            res.write('data: [DONE]\n\n');
          } else {
            try {
              const parsed = JSON.parse(data);
              res.write(`data: ${JSON.stringify(parsed)}\n\n`);
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    }
    
    res.end();
  } catch (error) {
    console.error('Chat error:', error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

// Calendly integration endpoint
app.get('/api/calendly-slots', async (req, res) => {
  const calendlyToken = process.env.CALENDLY_ACCESS_TOKEN;
  const calendlyUserUri = process.env.CALENDLY_USER_URI;
  
  if (!calendlyToken || !calendlyUserUri) {
    return res.json({ 
      available: false,
      message: 'Please call (510) 443-2123 or use our online intake form',
      fallbackUrl: '/client-area/intake-form'
    });
  }
  
  try {
    // Get user's event types
    const eventTypesResponse = await fetch(`https://api.calendly.com/event_types?user=${calendlyUserUri}&active=true`, {
      headers: {
        'Authorization': `Bearer ${calendlyToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!eventTypesResponse.ok) {
      throw new Error('Failed to fetch event types');
    }
    
    const eventTypesData = await eventTypesResponse.json();
    const eventTypes = eventTypesData.collection || [];
    
    // Get the first available event type (usually consultation)
    const consultationEvent = eventTypes.find(e => 
      e.name.toLowerCase().includes('consultation') || 
      e.name.toLowerCase().includes('meeting')
    ) || eventTypes[0];
    
    if (!consultationEvent) {
      return res.json({
        available: false,
        message: 'No consultation slots available. Please call (510) 443-2123',
        fallbackUrl: '/client-area/intake-form'
      });
    }
    
    // Return the consultation event details with scheduling URL
    // Note: Event Type Available Times API requires additional permissions
    // For now, we'll provide the direct scheduling link
    res.json({
      available: true,
      eventType: {
        name: consultationEvent.name,
        duration: consultationEvent.duration,
        description: consultationEvent.description_plain || consultationEvent.description_html,
        schedulingUrl: consultationEvent.scheduling_url
      },
      bookingUrl: consultationEvent.scheduling_url,
      message: `Schedule your ${consultationEvent.duration}-minute ${consultationEvent.name}`,
      instructions: 'Click the button below to view available times and book your consultation directly on Calendly.'
    });
    
  } catch (error) {
    console.error('Calendly API error:', error);
    res.json({
      available: false,
      message: 'Unable to fetch available times. Please call (510) 443-2123 or use our online intake form',
      fallbackUrl: '/client-area/intake-form',
      calendlyUrl: 'https://calendly.com/pritsinghlaw'
    });
  }
});

// Create Calendly booking endpoint
app.post('/api/calendly-booking', async (req, res) => {
  const { name, email, eventTypeUri, startTime } = req.body;
  const calendlyToken = process.env.CALENDLY_ACCESS_TOKEN;
  
  if (!calendlyToken) {
    return res.status(400).json({ 
      success: false,
      message: 'Booking system not configured. Please call (510) 443-2123'
    });
  }
  
  try {
    // Create invitee for the booking
    const response = await fetch('https://api.calendly.com/scheduled_events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${calendlyToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event_type: eventTypeUri,
        start_time: startTime,
        invitee: {
          name: name,
          email: email
        }
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      res.json({
        success: true,
        message: 'Consultation booked successfully!',
        eventUri: data.resource.uri,
        joinUrl: data.resource.join_url
      });
    } else {
      throw new Error('Failed to create booking');
    }
  } catch (error) {
    console.error('Calendly booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to complete booking. Please call (510) 443-2123'
    });
  }
});

// Zapier webhook endpoint
app.post('/api/intake-webhook', async (req, res) => {
  const { name, email, phone, issue, transcript } = req.body;
  
  if (process.env.ZAPIER_WEBHOOK_URL) {
    try {
      await fetch(process.env.ZAPIER_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, issue, transcript, timestamp: new Date().toISOString() })
      });
    } catch (error) {
      console.error('Zapier webhook error:', error);
    }
  }
  
  res.json({ success: true, message: 'Information received. We will contact you soon.' });
});

// Serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve specific HTML files
app.get('/:page', (req, res, next) => {
  const page = req.params.page;
  // Skip API routes
  if (page.startsWith('api')) {
    return next();
  }
  
  const htmlPath = path.join(__dirname, `${page}.html`);
  const directPath = path.join(__dirname, page);
  
  // Try .html extension first
  fs.access(htmlPath)
    .then(() => res.sendFile(htmlPath))
    .catch(() => {
      // Try direct path
      fs.access(directPath)
        .then(() => res.sendFile(directPath))
        .catch(() => next());
    });
});

// Serve nested HTML files (like /services/something)
app.get('/:dir/:page', (req, res, next) => {
  const { dir, page } = req.params;
  const filePath = path.join(__dirname, dir, `${page}.html`);
  
  fs.access(filePath)
    .then(() => res.sendFile(filePath))
    .catch(() => next());
});

// 404 handler
app.use((req, res) => {
  res.status(404).send('Page not found');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`OpenAI Model: ${process.env.OPENAI_MODEL || 'gpt-4o-mini (fallback)'}`);
});