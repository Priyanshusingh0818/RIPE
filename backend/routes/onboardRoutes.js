const express = require('express');
const router = express.Router();
const { onboard } = require('../controllers/onboardController');

router.post('/', onboard);

module.exports = router;
