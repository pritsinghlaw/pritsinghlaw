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
  if (!process.env.CALENDLY_API_KEY) {
    return res.json({ 
      available: false,
      message: 'Please call (510) 443-2123 or use our online intake form',
      fallbackUrl: '/client-area/intake-form'
    });
  }
  
  // TODO: Implement actual Calendly API integration
  res.json({
    available: true,
    slots: [
      { time: 'Tomorrow at 10:00 AM', available: true },
      { time: 'Tomorrow at 2:00 PM', available: true },
      { time: 'Friday at 11:00 AM', available: true }
    ]
  });
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