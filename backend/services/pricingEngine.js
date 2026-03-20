/**
 * Pricing Engine
 * Determines the insurance premium based on the user's risk score.
 *
 * @param {number} riskScore – 0–100
 * @returns {Object} – { premium, tier }
 */
const calculatePremium = (riskScore) => {
  let premium;
  let tier;

  if (riskScore < 30) {
    premium = 49;
    tier = 'LOW';
  } else if (riskScore < 60) {
    premium = 79;
    tier = 'MEDIUM';
  } else {
    premium = 99;
    tier = 'HIGH';
  }

  console.log(`[PRICING] Risk ${riskScore} → ₹${premium}/day (${tier})`);

  return { premium, tier, currency: 'INR' };
};

module.exports = { calculatePremium };
