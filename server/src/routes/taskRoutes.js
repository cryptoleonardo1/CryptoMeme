// src/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const {
  createTask,
  completeTask
} = require('../controllers/taskController');

// Routes
router.post('/create', createTask);
router.post('/complete', completeTask);

module.exports = router;