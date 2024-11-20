// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
  createUser,
  getUser,
  updatePoints
} = require('../controllers/userController');

// Routes
router.post('/create', createUser);
router.get('/:telegramId', getUser);
router.post('/points', updatePoints);

module.exports = router;