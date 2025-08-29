
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai');

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

// OpenAI Chatbot endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversation = [] } = req.body;

    // System prompt for Pritpal Singh Law chatbot
    const systemPrompt = `You are PritAI, the virtual assistant for the Law Offices of Pritpal Singh, PC, a California real estate law firm. You are friendly, professional, and helpful. Your primary functions are:

1. COLLECT CLIENT INFORMATION: Always ask for name, email, phone number, and case details early in conversations
2. QUALIFY LEADS: Ask targeted questions about their real estate legal issue to determine if it fits our practice
3. SCHEDULE CONSULTATIONS: Guide clients to book paid consultations at https://pritsinghlaw.com/bookings/consultation
4. ANSWER GENERAL QUESTIONS: Provide general information about California real estate law (NOT specific legal advice)
5. PROVIDE ATTORNEY INFO: Share background on Pritpal Singh (licensed CA attorney, Bar #350741, specializes in real estate law)

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
