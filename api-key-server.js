
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
const fetch = require('node-fetch');

// Calendly API configuration
const CALENDLY_ACCESS_TOKEN = process.env.CALENDLY_ACCESS_TOKEN;
const CALENDLY_USER_URI = process.env.CALENDLY_USER_URI;
const CALENDLY_API_BASE = 'https://api.calendly.com';

const app = express();
const port = 5000;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Serve the API key from environment variable
app.get('/api/get-gemini-key', (req, res) => {
  res.json({ key: process.env.GEMINI_API_KEY || '' });
});

// Calendly API functions
const calendlyAPI = {
  headers: {
    'Authorization': `Bearer ${CALENDLY_ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  },

  async getCurrentUser() {
    const response = await fetch(`${CALENDLY_API_BASE}/users/me`, {
      headers: this.headers
    });
    return await response.json();
  },

  async getEventTypes(userUri) {
    const response = await fetch(`${CALENDLY_API_BASE}/event_types?user=${encodeURIComponent(userUri)}`, {
      headers: this.headers
    });
    return await response.json();
  },

  async getScheduledEvents(userUri, minStartTime) {
    const url = `${CALENDLY_API_BASE}/scheduled_events?user=${encodeURIComponent(userUri)}&min_start_time=${minStartTime}&sort=start_time:asc&count=10`;
    const response = await fetch(url, {
      headers: this.headers
    });
    return await response.json();
  }
};

// Calendly integration endpoint
app.get('/api/calendly/event-types', async (req, res) => {
  try {
    if (!CALENDLY_ACCESS_TOKEN || !CALENDLY_USER_URI) {
      return res.status(400).json({ 
        error: 'Calendly credentials not configured',
        success: false 
      });
    }

    const eventTypes = await calendlyAPI.getEventTypes(CALENDLY_USER_URI);
    
    // Format for chatbot use
    const formattedEventTypes = eventTypes.collection?.map(event => ({
      name: event.name,
      description: event.description_plain,
      duration: event.duration,
      scheduling_url: event.scheduling_url,
      slug: event.slug
    })) || [];

    res.json({ 
      eventTypes: formattedEventTypes,
      success: true 
    });

  } catch (error) {
    console.error('Calendly API Error:', error);
    res.status(500).json({ 
      error: 'Unable to fetch appointment types',
      success: false 
    });
  }
});

// Get upcoming appointments
app.get('/api/calendly/upcoming-events', async (req, res) => {
  try {
    if (!CALENDLY_ACCESS_TOKEN || !CALENDLY_USER_URI) {
      return res.status(400).json({ 
        error: 'Calendly credentials not configured',
        success: false 
      });
    }

    const now = new Date().toISOString();
    const events = await calendlyAPI.getScheduledEvents(CALENDLY_USER_URI, now);
    
    // Format for chatbot use
    const formattedEvents = events.collection?.map(event => ({
      name: event.name,
      start_time: event.start_time,
      end_time: event.end_time,
      status: event.status
    })) || [];

    res.json({ 
      upcomingEvents: formattedEvents,
      success: true 
    });

  } catch (error) {
    console.error('Calendly API Error:', error);
    res.status(500).json({ 
      error: 'Unable to fetch upcoming appointments',
      success: false 
    });
  }
});

// OpenAI Chatbot endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversation = [] } = req.body;

    // Get Calendly event types for dynamic booking links
    let calendlyEventTypes = [];
    try {
      const eventTypesResponse = await fetch('http://localhost:5000/api/calendly/event-types');
      if (eventTypesResponse.ok) {
        const eventData = await eventTypesResponse.json();
        calendlyEventTypes = eventData.eventTypes || [];
      }
    } catch (error) {
      console.log('Could not fetch Calendly event types:', error.message);
    }

    // Build dynamic booking options text
    let bookingOptionsText = '';
    if (calendlyEventTypes.length > 0) {
      bookingOptionsText = '\n\nAVAILABLE APPOINTMENT TYPES:\n';
      calendlyEventTypes.forEach((eventType, index) => {
        bookingOptionsText += `${index + 1}. **${eventType.name}** (${eventType.duration} min) - ${eventType.description || 'Professional consultation'}\n   Book at: ${eventType.scheduling_url}\n`;
      });
      bookingOptionsText += '\nWhen clients want to schedule appointments, provide them with the specific booking link for the appropriate consultation type.';
    } else {
      bookingOptionsText = '\n\nFor appointment booking, direct clients to: https://pritsinghlaw.com/bookings/consultation';
    }

    // System prompt for Pritpal Singh Law chatbot
    const systemPrompt = `You are the AI Legal Assistant for the Law Offices of Pritpal Singh, PC, a California real estate law firm. You are friendly, professional, and helpful. Your primary functions are:

1. COLLECT CLIENT INFORMATION: Always ask for name, email, phone number, and case details early in conversations
2. QUALIFY LEADS: Ask targeted questions about their real estate legal issue to determine if it fits our practice
3. SCHEDULE CONSULTATIONS: Intelligently direct clients to the appropriate appointment booking links based on their needs
4. ANSWER GENERAL QUESTIONS: Provide general information about California real estate law (NOT specific legal advice)
5. PROVIDE ATTORNEY INFO: Share background on Pritpal Singh (licensed CA attorney, Bar #350741, specializes in real estate law)${bookingOptionsText}

IMPORTANT GUIDELINES:
- Never provide specific legal advice - always recommend scheduling a consultation for detailed guidance
- Focus only on California real estate law matters (transactions, landlord/tenant, property disputes, title issues)
- If asked about other legal areas, politely refer them elsewhere
- Be empathetic and acknowledge their concerns
- Ask follow-up questions to gather details (property type, timeline, urgency, etc.)
- For billing questions, direct them to contact the office directly
- Always maintain a professional, warm tone
- Suggest scheduling a consultation when appropriate

ABOUT PRITPAL SINGH:
- Licensed California attorney (Bar #350741) 
- Admitted November 2023
- Specializes in real estate law and litigation
- Graduate of San Francisco Law School
- Speaks English, Punjabi, Hindi, Urdu
- Former senior paralegal in civil litigation

FIRM SERVICES:
- Real estate transactions (buying/selling)
- Landlord/tenant disputes
- Property litigation
- Title and escrow issues
- Contract drafting and review
- Adverse possession cases

Start conversations warmly and be ready to help with their real estate legal needs.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversation,
      { role: 'user', content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;

    res.json({ 
      response,
      success: true 
    });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ 
      error: 'Sorry, I encountered an error. Please try again or contact our office directly at (510) 225-9220.',
      success: false 
    });
  }
});

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Law firm website and API server running on port ${port}`);
});
