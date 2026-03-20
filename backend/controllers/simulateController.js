const { simulateEvent } = require('../services/eventTriggerEngine');
const { delay, timestamp } = require('../utils/helpers');

/**
 * POST /api/simulate
 *
 * Simulates a disruption event.
 * Input: { eventType: "rain" | "heat" | "pollution" | "curfew" | "app_down" }
 */
const simulate = async (req, res, next) => {
  try {
    const { eventType } = req.body;
    console.log(`[SIMULATE] Incoming request: eventType=${eventType}`);

    if (!eventType) {
      return res.status(400).json({
        success: false,
        error: 'eventType is required. Supported: rain, heat, pollution, curfew, app_down',
        timestamp: timestamp(),
      });
    }

    // Simulate processing delay
    await delay(500);

    const event = simulateEvent(eventType);

    res.status(200).json({
      success: true,
      data: { event },
      timestamp: timestamp(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { simulate };
