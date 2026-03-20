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

// --- Serve frontend in production (local only, Vercel CDN handles this) ---
const path = require('path');
if (!process.env.VERCEL) {
  const distPath = path.resolve(__dirname, '..', 'dist');
  app.use(express.static(distPath));

  // SPA fallback for non-API routes
  app.use((req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({
        success: false,
        error: 'Route not found',
        timestamp: new Date().toISOString(),
      });
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // On Vercel, only handle API 404s
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: 'Route not found',
      timestamp: new Date().toISOString(),
    });
  });
}

// --- Global error handler ---
app.use(errorHandler);

// --- Start server (only when running locally, not on Vercel) ---
if (!process.env.VERCEL) {
  const PORT = config.PORT;
  app.listen(PORT, () => {
    console.log(`\n🚀 RIPE Engine Backend running on http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Groq API Key: ${config.GROQ_API_KEY ? '✓ loaded' : '✗ missing'}\n`);
  });
}

module.exports = app;
