/**
 * Payout Engine
 * Calculates the payout amount for a claim.
 *
 * Formula:
 *   hourlyIncome = weeklyIncome / 40
 *   lostHours    = event.duration
 *   payout       = min(hourlyIncome * lostHours, 1500)
 *
 * @param {Object} user  – user persona (must have weeklyIncome)
 * @param {Object} event – triggered event (must have duration)
 * @returns {Object} – { payout, hourlyIncome, lostHours, maxPayout, currency }
 */
const calculatePayout = (user, event) => {
  const hourlyIncome = user.weeklyIncome / 40;
  const lostHours = event.duration;
  const maxPayout = 1500;

  const rawPayout = hourlyIncome * lostHours;
  const payout = Math.min(Math.round(rawPayout * 100) / 100, maxPayout);

  console.log(
    `[PAYOUT] ₹${hourlyIncome.toFixed(2)}/hr × ${lostHours}h = ₹${rawPayout.toFixed(2)} → capped ₹${payout}`
  );

  return {
    payout,
    hourlyIncome: Math.round(hourlyIncome * 100) / 100,
    lostHours,
    maxPayout,
    currency: 'INR',
  };
};

module.exports = { calculatePayout };
