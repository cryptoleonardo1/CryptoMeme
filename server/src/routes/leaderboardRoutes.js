// leaderboardRoutes.js
const express = require('express');
const router = express.Router();
const LeaderboardController = require('../controllers/LeaderboardController');
const { bypassAuthInDevelopment } = require('../middleware/auth');

router.get('/',
  bypassAuthInDevelopment,
  LeaderboardController.getLeaderboard
);

router.get('/user/:telegramId',
  bypassAuthInDevelopment,
  LeaderboardController.getUserRank
);

module.exports = router;