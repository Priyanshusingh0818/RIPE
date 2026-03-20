const express = require('express');
const cors = require('cors');
const config = require('./config');
const errorHandler = require('./middleware/errorHandler');

// --- Route imports ---
const onboardRoutes = require('./routes/onboardRoutes');
const simulateRoutes = require('./routes/simulateRoutes');
const claimRoutes = require('./routes/claimRoutes');
const explainRoutes = require('./routes/explainRoutes');

// --- Initialise Express app ---
const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Request logger ---
app.use((req, _res, next) => {
  console.log(`\n→ ${req.method} ${req.url} [${new Date().toISOString()}]`);
  next();
});

// --- Health check ---
app.get('/', (_req, res) => {
  res.json({
    service: 'RIPE Engine – Real-time Income Protection Engine',
    version: '1.0.0',
    status: 'running',
    endpoints: [
      'POST /api/onboard',
      'POST /api/simulate',
      'POST /api/claim',
      'POST /api/explain',
    ],
    timestamp: new Date().toISOString(),
  });
});

// --- API Routes ---
app.use('/api/onboard', onboardRoutes);
app.use('/api/simulate', simulateRoutes);
app.use('/api/claim', claimRoutes);
app.use('/api/explain', explainRoutes);

// --- Serve frontend in production ---
const path = require('path');
const distPath = path.resolve(__dirname, '..', 'dist');
app.use(express.static(distPath));

// --- SPA fallback + API 404 ---
app.use((req, res) => {
  // If it's an API route that doesn't exist, return JSON 404
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      error: 'Route not found',
      timestamp: new Date().toISOString(),
    });
  }
  // For everything else, serve the frontend (SPA routing)
  res.sendFile(path.join(distPath, 'index.html'));
});

// --- Global error handler ---
app.use(errorHandler);

// --- Start server ---
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`\n🚀 RIPE Engine Backend running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Groq API Key: ${config.GROQ_API_KEY ? '✓ loaded' : '✗ missing'}\n`);
});

module.exports = app;
