const { generateExplanation } = require('../services/aiExplanationEngine');
const { delay, timestamp } = require('../utils/helpers');

/**
 * POST /api/explain
 *
 * Generates an AI-powered explanation for a claim decision.
 * Input: { event, payout, riskScore, fraudLevel?, status? }
 */
const explain = async (req, res, next) => {
  try {
    const { event, payout, riskScore, fraudLevel, status } = req.body;
    console.log(`[EXPLAIN] Incoming request: event=${event}, payout=${payout}, riskScore=${riskScore}`);

    if (!event || payout === undefined || riskScore === undefined) {
      return res.status(400).json({
        success: false,
        error: 'event, payout, and riskScore are required',
        timestamp: timestamp(),
      });
    }

    // Simulate processing
    await delay(300);

    const result = await generateExplanation({
      event,
      payout,
      riskScore,
      fraudLevel: fraudLevel || 'LOW',
      status: status || 'APPROVED',
    });

    res.status(200).json({
      success: true,
      data: result,
      timestamp: timestamp(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { explain };
