const axios = require('axios');
const config = require('../config');

/**
 * AI Explanation Engine (Qwen 3 32B via Groq)
 *
 * Generates a human-readable explanation of a claim decision
 * using the Groq chat completions API.
 *
 * @param {Object} data – { event, payout, riskScore, fraudLevel, status }
 * @returns {Object} – { explanation }
 */
const generateExplanation = async (data) => {
  const { event, payout, riskScore, fraudLevel, status } = data;

  console.log(`[AI] Generating explanation via Qwen 3 32B (Groq)...`);

  const prompt = `You are an AI assistant for RIPE Engine, a parametric insurance platform protecting delivery workers from income loss.

Explain the following claim decision in simple, empathetic language that a delivery worker would understand. Keep it concise (3-4 sentences max).

Details:
- Event: ${event || 'disruption event'}
- Payout Amount: ₹${payout || 0}
- Risk Score: ${riskScore || 'N/A'}/100
- Fraud Assessment: ${fraudLevel || 'LOW'}
- Claim Status: ${status || 'PROCESSED'}

Provide a clear, friendly explanation of why the user received this payout amount. If the claim was rejected or partially approved, explain why briefly. Do not use technical jargon. Do not use markdown formatting.`;

  try {
    const response = await axios.post(
      config.GROQ_URL,
      {
        model: config.GROQ_MODEL,
        messages: [
          { role: 'user', content: prompt },
        ],
        max_tokens: 300,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${config.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    let explanation =
      response.data?.choices?.[0]?.message?.content?.trim() ||
      'Unable to generate explanation at this time.';

    // Strip Qwen's <think>...</think> reasoning tags
    explanation = explanation.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

    console.log(`[AI] Explanation generated successfully`);

    return { explanation };
  } catch (error) {
    console.error(`[AI] Groq API error: ${error.message}`);

    // Graceful fallback — never let AI failure break the flow
    const fallback = `Your claim for the ${event || 'disruption'} event has been processed. `
      + `Based on a risk score of ${riskScore || 'N/A'}/100, your payout is ₹${payout || 0}. `
      + `This amount factors in lost working hours and our coverage limits.`;

    return { explanation: fallback, fallback: true };
  }
};

module.exports = { generateExplanation };
