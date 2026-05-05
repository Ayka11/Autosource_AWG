const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

// Runtime config for the SPA (CRA env vars are fixed at build time; Cloud Run can set these instead).
app.get('/runtime-config.js', (req, res) => {
  const cfg = {
    REACT_APP_GOOGLE_CLIENT_ID:
      process.env.REACT_APP_GOOGLE_CLIENT_ID ||
      process.env.GOOGLE_CLIENT_ID ||
      '',
    REACT_APP_VERTEX_API_KEY:
      process.env.REACT_APP_VERTEX_API_KEY || '',
  };
  res.type('application/javascript');
  res.set('Cache-Control', 'no-store');
  res.send(`window.__RUNTIME_CONFIG__=${JSON.stringify(cfg)};`);
});

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
