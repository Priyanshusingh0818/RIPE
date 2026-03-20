const { createPersona } = require('../services/personaEngine');
const { calculateRisk } = require('../services/riskEngine');
const { calculatePremium } = require('../services/pricingEngine');
const { delay, timestamp } = require('../utils/helpers');

/**
 * POST /api/onboard
 *
 * Onboards a new delivery worker:
 *   1. Creates persona
 *   2. Calculates risk score
 *   3. Determines premium
 */
const onboard = async (req, res, next) => {
  try {
    console.log('[ONBOARD] Incoming request:', JSON.stringify(req.body));

    // Simulate processing
    await delay(600);

    // 1. Create user persona
    const user = createPersona(req.body);

    // 2. Calculate risk
    const risk = calculateRisk(user);

    // 3. Determine premium
    const pricing = calculatePremium(risk.riskScore);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          platform: user.platform,
          location: user.location,
          weeklyIncome: user.weeklyIncome,
        },
        risk: {
          riskScore: risk.riskScore,
          factors: risk.factors,
        },
        pricing,
      },
      timestamp: timestamp(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { onboard };
