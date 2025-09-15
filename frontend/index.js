
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static('static'));

// API proxy endpoints
app.get('/api/events', async (req, res) => {
  const url = process.env.EVENTS_URL || 'http://events-service:5000/events';
  try {
    const r = await fetch(url);
    const j = await r.json();
    res.json(j);
  } catch (e) {
    res.status(500).json({error: String(e)});
  }
});

app.get('/metrics', (req, res) => {
  res.send('# Frontend metrics placeholder\nfrontend_uptime_seconds 123\n');
});

app.listen(PORT, ()=> console.log('Frontend listening on', PORT));
