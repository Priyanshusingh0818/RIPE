let app;

try {
  app = require('../backend/server');
} catch (error) {
  // If the backend fails to load, return useful error info
  const express = require('express');
  app = express();
  app.use((req, res) => {
    res.status(500).json({
      success: false,
      error: 'Backend failed to initialize',
      details: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
    });
  });
}

module.exports = app;
