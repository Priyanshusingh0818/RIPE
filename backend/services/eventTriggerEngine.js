const { v4: uuidv4 } = require('uuid');
const store = require('../models/store');
const { timestamp } = require('../utils/helpers');

/**
 * Event Trigger Engine
 * Simulates disruption events that affect delivery workers.
 *
 * Supported event types: rain, heat, pollution, curfew, app_down
 *
 * @param {string} eventType
 * @returns {Object} – event data
 */
const simulateEvent = (eventType) => {
  const type = (eventType || '').toLowerCase();

  const eventTemplates = {
    rain: {
      label: 'Heavy Rainfall',
      severityRange: [4, 9],
      durationRange: [2, 6],
      areas: ['South Mumbai', 'Andheri', 'Whitefield', 'Koramangala', 'Connaught Place'],
    },
    heat: {
      label: 'Extreme Heat Wave',
      severityRange: [5, 10],
      durationRange: [3, 8],
      areas: ['Central Delhi', 'Jaipur City', 'Lucknow Central', 'Hyderabad Suburbs'],
    },
    pollution: {
      label: 'Severe Air Pollution',
      severityRange: [3, 8],
      durationRange: [4, 12],
      areas: ['Delhi NCR', 'Gurugram', 'Noida', 'Faridabad'],
    },
    curfew: {
      label: 'Government Curfew',
      severityRange: [7, 10],
      durationRange: [6, 24],
      areas: ['City-Wide', 'State-Wide'],
    },
    app_down: {
      label: 'Platform App Downtime',
      severityRange: [6, 9],
      durationRange: [1, 4],
      areas: ['Pan-India', 'Regional Servers'],
    },
  };

  const template = eventTemplates[type];

  if (!template) {
    const supported = Object.keys(eventTemplates).join(', ');
    throw Object.assign(
      new Error(`Unsupported event type: "${eventType}". Supported: ${supported}`),
      { statusCode: 400 }
    );
  }

  const [sevMin, sevMax] = template.severityRange;
  const [durMin, durMax] = template.durationRange;

  const eventSeverity = Math.floor(Math.random() * (sevMax - sevMin + 1)) + sevMin;
  const duration = Math.floor(Math.random() * (durMax - durMin + 1)) + durMin;
  const affectedArea = template.areas[Math.floor(Math.random() * template.areas.length)];

  const event = {
    id: uuidv4(),
    type,
    label: template.label,
    eventSeverity,
    duration,
    affectedArea,
    triggeredAt: timestamp(),
  };

  store.events.push(event);
  console.log(`[EVENT] ${template.label} (severity ${eventSeverity}) in ${affectedArea} – ${duration}h`);

  return event;
};

/**
 * Find an event by ID.
 */
const getEventById = (eventId) => {
  return store.events.find((e) => e.id === eventId) || null;
};

module.exports = { simulateEvent, getEventById };
