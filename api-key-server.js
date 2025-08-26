
const express = require('express');
const app = express();
const port = 3001;

// Serve the API key from environment variable
app.get('/api/get-gemini-key', (req, res) => {
  res.json({ key: process.env.GEMINI_API_KEY || '' });
});

app.listen(port, () => {
  console.log(`API key server running on port ${port}`);
});
