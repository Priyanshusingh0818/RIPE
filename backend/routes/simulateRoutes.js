const express = require('express');
const router = express.Router();
const { simulate } = require('../controllers/simulateController');

router.post('/', simulate);

module.exports = router;
