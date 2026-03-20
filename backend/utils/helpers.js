const { v4: uuidv4 } = require('uuid');

/**
 * Simulate processing delay for realism.
 * @param {number} ms – milliseconds to wait
 */
const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generate a unique claim ID.
 * @returns {string} – prefixed UUID e.g. "CLM-xxxx"
 */
const generateClaimId = () => `CLM-${uuidv4().split('-')[0].toUpperCase()}`;

/**
 * Current ISO timestamp.
 * @returns {string}
 */
const timestamp = () => new Date().toISOString();

module.exports = { delay, generateClaimId, timestamp };
