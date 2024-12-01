const express = require('express');
const router = express.Router();
const {
  updateInteraction,
  getLeaderboard
} = require('../controllers/interactionController');

// Test route
router.get('/test', (req, res) => {
  res.json({ status: 'ok', message: 'Interaction routes working' });
});

// Main routes
router.post('/update', updateInteraction);
router.get('/leaderboard', getLeaderboard);

module.exports = router;