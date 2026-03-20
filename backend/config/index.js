const dotenv = require('dotenv');
const path = require('path');

// Load .env from the backend root
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const config = {
  PORT: process.env.PORT || 5000,
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  GROQ_URL: 'https://api.groq.com/openai/v1/chat/completions',
  GROQ_MODEL: 'qwen/qwen3-32b',
};

module.exports = config;
