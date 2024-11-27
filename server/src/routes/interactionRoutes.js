
const express = require('express');
const router = express.Router();
const {
  updateInteraction,
  getLeaderboard
} = require('../controllers/interactionController');

// Routes
router.post('/update', updateInteraction);
router.get('/leaderboard', getLeaderboard);
router.get('/debug', interactionController.debug);

module.exports = router;