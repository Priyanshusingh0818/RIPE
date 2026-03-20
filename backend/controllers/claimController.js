const { getUserById } = require('../services/personaEngine');
const { simulateEvent } = require('../services/eventTriggerEngine');
const { processClaim } = require('../services/claimEngine');
const { calculateRisk } = require('../services/riskEngine');
const { delay, timestamp } = require('../utils/helpers');

/**
 * POST /api/claim
 *
 * Processes a full claim through the pipeline:
 *   - Looks up user
 *   - Simulates or looks up event
 *   - Runs claim engine (fraud + payout)
 *
 * Input: { userId, eventType } or { userId, eventId }
 */
const claim = async (req, res, next) => {
  try {
    const { userId, eventType, eventId } = req.body;
    console.log(`[CLAIM] Incoming request: userId=${userId}, eventType=${eventType}`);

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required',
        timestamp: timestamp(),
      });
    }

    if (!eventType && !eventId) {
      return res.status(400).json({
        success: false,
        error: 'eventType or eventId is required',
        timestamp: timestamp(),
      });
    }

    // Simulate processing
    await delay(1000);

    // 1. Find user (or reconstruct if serverless memory lost them)
    let user = getUserById(userId);
    if (!user) {
      console.log(`[CLAIM] User ${userId} not in memory, reconstructing from fallback`);
      const { createPersona } = require('../services/personaEngine');
      const fallback = req.body.userFallback || { 
        name: 'Demo Worker', 
        platform: 'Zomato', 
        location: 'Mumbai', 
        weeklyIncome: 5000 
      };
      user = createPersona(fallback);
      user.id = userId; // Override generated ID to match the requested one
    }

    // 2. Get or simulate event
    let event;
    if (eventId) {
      const { getEventById } = require('../services/eventTriggerEngine');
      event = getEventById(eventId);
      if (!event) {
        return res.status(404).json({
          success: false,
          error: `Event not found: ${eventId}`,
          timestamp: timestamp(),
        });
      }
    } else {
      event = simulateEvent(eventType);
    }

    // 3. Process claim (includes fraud check + payout)
    const claimResult = processClaim(user, event);

    // 4. Get risk score for context
    const risk = calculateRisk(user);

    res.status(200).json({
      success: true,
      data: {
        claim: claimResult,
        event,
        riskScore: risk.riskScore,
      },
      timestamp: timestamp(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { claim };
