const store = require('../models/store');
const { generateClaimId, timestamp } = require('../utils/helpers');
const { calculateFraudScore } = require('./fraudEngine');
const { calculatePayout } = require('./payoutEngine');

/**
 * Claim Engine
 * Processes an insurance claim through the full pipeline:
 *   1. Validate event exists
 *   2. Validate user is active
 *   3. Run fraud check
 *   4. Calculate payout (adjusted by fraud level)
 *   5. Store and return claim record
 *
 * @param {Object} user  – user persona
 * @param {Object} event – triggered event
 * @returns {Object} – claim result
 */
const processClaim = (user, event) => {
  console.log(`[CLAIM] Processing claim for user ${user.id} – event ${event.id}`);

  // 1. Validate event
  if (!event || !event.id) {
    throw Object.assign(new Error('Invalid or missing event data'), { statusCode: 400 });
  }

  // 2. Validate user
  if (!user || !user.isActive) {
    throw Object.assign(new Error('User is not active or does not exist'), { statusCode: 400 });
  }

  // 3. Fraud check
  const fraud = calculateFraudScore(user, event);

  // 4. Determine claim status & payout based on fraud level
  let status;
  let payoutResult;

  if (fraud.level === 'HIGH') {
    status = 'REJECTED';
    payoutResult = { payout: 0, hourlyIncome: 0, lostHours: event.duration, maxPayout: 1500, currency: 'INR' };
    console.log(`[CLAIM] REJECTED – High fraud risk`);
  } else {
    payoutResult = calculatePayout(user, event);

    if (fraud.level === 'MEDIUM') {
      // Partial payout (50%)
      payoutResult.payout = Math.round(payoutResult.payout * 0.5 * 100) / 100;
      status = 'APPROVED_PARTIAL';
      console.log(`[CLAIM] PARTIAL APPROVAL – Medium fraud risk, payout halved to ₹${payoutResult.payout}`);
    } else {
      status = 'APPROVED';
      console.log(`[CLAIM] APPROVED – ₹${payoutResult.payout}`);
    }
  }

  // 5. Build claim record
  const claim = {
    claimId: generateClaimId(),
    userId: user.id,
    eventId: event.id,
    eventType: event.type,
    status,
    fraud,
    payout: payoutResult,
    processedAt: timestamp(),
  };

  // Persist to in-memory store
  store.claims.push(claim);

  // Update user claim history
  user.claimHistory.push({
    claimId: claim.claimId,
    eventType: event.type,
    status,
    amount: payoutResult.payout,
    date: claim.processedAt,
  });

  return claim;
};

module.exports = { processClaim };
