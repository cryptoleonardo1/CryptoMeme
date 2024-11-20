// src/routes/memeRoutes.js
const express = require('express');
const router = express.Router();
const {
  createMeme,
  getNextMeme,
  interactWithMeme
} = require('../controllers/memeController');

// Routes
router.post('/create', createMeme);
router.get('/next/:userId', getNextMeme);
router.post('/interact', interactWithMeme);

module.exports = router;