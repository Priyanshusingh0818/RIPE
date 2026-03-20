const express = require('express');
const router = express.Router();
const { claim } = require('../controllers/claimController');

router.post('/', claim);

module.exports = router;
