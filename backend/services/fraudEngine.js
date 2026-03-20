/**
 * Fraud Engine
 * Calculates a fraud risk level based on user behaviour patterns.
 *
 * Checks:
 *   1. Location consistency – is the user's location in the affected area?
 *   2. Claim frequency   – too many claims in a short window?
 *   3. Duplicate check    – same event type claimed twice?
 *
 * @param {Object} user  – user persona
 * @param {Object} event – triggered event
 * @returns {Object} – { fraudScore, level, checks }
 */
const calculateFraudScore = (user, event) => {
  console.log(`[FRAUD] Analysing user ${user.id} for event ${event.id}`);

  let score = 0;
  const checks = {};

  // --- 1. Location consistency ---
  const userLoc = (user.location || '').toLowerCase();
  const eventArea = (event.affectedArea || '').toLowerCase();
  const locationMatch = eventArea.includes(userLoc) || userLoc.includes(eventArea.split(' ')[0]);
  if (!locationMatch) {
    score += 35;
    checks.locationConsistency = 'MISMATCH';
  } else {
    checks.locationConsistency = 'MATCH';
  }

  // --- 2. Claim frequency (more than 3 claims = suspicious) ---
  const recentClaims = user.claimHistory ? user.claimHistory.length : 0;
  if (recentClaims > 5) {
    score += 40;
    checks.claimFrequency = 'EXCESSIVE';
  } else if (recentClaims > 3) {
    score += 20;
    checks.claimFrequency = 'ELEVATED';
  } else {
    checks.claimFrequency = 'NORMAL';
  }

  // --- 3. Duplicate event type ---
  const duplicateClaim = (user.claimHistory || []).some(
    (c) => c.eventType === event.type && c.status === 'APPROVED'
  );
  if (duplicateClaim) {
    score += 25;
    checks.duplicateCheck = 'DUPLICATE_FOUND';
  } else {
    checks.duplicateCheck = 'CLEAN';
  }

  // --- Determine level ---
  let level;
  if (score >= 60) {
    level = 'HIGH';
  } else if (score >= 30) {
    level = 'MEDIUM';
  } else {
    level = 'LOW';
  }

  console.log(`[FRAUD] Score: ${score} → ${level} | Checks: ${JSON.stringify(checks)}`);

  return { fraudScore: score, level, checks };
};

module.exports = { calculateFraudScore };
