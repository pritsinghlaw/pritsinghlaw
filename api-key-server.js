
const express = require('express');
const path = require('path');
const app = express();
const port = 5000;

// Serve static files from the current directory
app.use(express.static(__dirname));

// Serve the API key from environment variable
app.get('/api/get-gemini-key', (req, res) => {
  res.json({ key: process.env.GEMINI_API_KEY || '' });
});

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Law firm website and API server running on port ${port}`);
});
