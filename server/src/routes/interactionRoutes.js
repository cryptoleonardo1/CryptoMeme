
const express = require('express');
const router = express.Router();
const {
  updateInteraction,
  getLeaderboard
} = require('../controllers/interactionController');

// Routes
router.post('/update', updateInteraction);
router.get('/leaderboard', getLeaderboard);

module.exports = router;