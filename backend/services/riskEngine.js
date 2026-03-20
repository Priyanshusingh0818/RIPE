/**
 * Risk Engine
 * Calculates a 0–100 risk score for a user based on location,
 * disruption history, mock pollution data, and mock weather risk.
 *
 * @param {Object} user – user persona object
 * @returns {Object} – { riskScore, factors }
 */
const calculateRisk = (user) => {
  console.log(`[RISK] Calculating risk for user ${user.id} in ${user.location}`);

  // ----- Location risk (mock data) -----
  const locationRiskMap = {
    mumbai: 35,
    delhi: 40,
    bangalore: 25,
    chennai: 30,
    hyderabad: 28,
    kolkata: 32,
    pune: 22,
    jaipur: 26,
    ahmedabad: 24,
    lucknow: 29,
  };
  const locationKey = user.location.toLowerCase();
  const locationRisk = locationRiskMap[locationKey] || 20;

  // ----- Disruption history -----
  const historyCount = user.disruptionHistory ? user.disruptionHistory.length : 0;
  const disruptionRisk = Math.min(historyCount * 5, 25);

  // ----- Mock pollution level (AQI-based) -----
  const pollutionLevels = { mumbai: 55, delhi: 85, bangalore: 40, chennai: 50, hyderabad: 45, kolkata: 60 };
  const pollutionRaw = pollutionLevels[locationKey] || 30;
  const pollutionRisk = Math.round((pollutionRaw / 100) * 20);

  // ----- Mock weather risk -----
  const weatherRisks = { mumbai: 60, delhi: 45, bangalore: 30, chennai: 55, kolkata: 50 };
  const weatherRaw = weatherRisks[locationKey] || 25;
  const weatherRisk = Math.round((weatherRaw / 100) * 20);

  // ----- Composite score (capped 0–100) -----
  const rawScore = locationRisk + disruptionRisk + pollutionRisk + weatherRisk;
  const riskScore = Math.min(Math.max(Math.round(rawScore), 0), 100);

  const factors = {
    locationRisk,
    disruptionRisk,
    pollutionRisk,
    weatherRisk,
  };

  console.log(`[RISK] Score: ${riskScore} | Factors: ${JSON.stringify(factors)}`);

  return { riskScore, factors };
};

module.exports = { calculateRisk };
