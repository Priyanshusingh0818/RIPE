const { v4: uuidv4 } = require('uuid');
const store = require('../models/store');
const { timestamp } = require('../utils/helpers');

/**
 * Persona Engine
 * Creates and stores a user persona for a delivery worker.
 *
 * @param {Object} data – { name, platform, location, weeklyIncome }
 * @returns {Object} – the created user persona
 */
const createPersona = (data) => {
  const { name, platform, location, weeklyIncome } = data;

  if (!name || !platform || !location || !weeklyIncome) {
    throw Object.assign(new Error('Missing required fields: name, platform, location, weeklyIncome'), { statusCode: 400 });
  }

  const validPlatforms = ['Zomato', 'Swiggy', 'Zepto', 'Amazon', 'Blinkit', 'Dunzo'];
  const normalizedPlatform = validPlatforms.find(
    (p) => p.toLowerCase() === platform.toLowerCase()
  ) || platform;

  const user = {
    id: uuidv4(),
    name,
    platform: normalizedPlatform,
    location,
    weeklyIncome: Number(weeklyIncome),
    isActive: true,
    claimHistory: [],
    disruptionHistory: [],
    createdAt: timestamp(),
  };

  store.users.push(user);
  console.log(`[PERSONA] Created persona for ${user.name} (${user.platform}) – ID: ${user.id}`);

  return user;
};

/**
 * Find a user by ID.
 */
const getUserById = (userId) => {
  return store.users.find((u) => u.id === userId) || null;
};

module.exports = { createPersona, getUserById };
