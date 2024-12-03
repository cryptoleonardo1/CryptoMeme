const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Environment Constants
const PORT = process.env.PORT || 3001;
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://cryptomeme-theta.vercel.app'
];

// Middleware Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Telegram WebApp)
    if (!origin) return callback(null, true);
    
    if (ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`Blocked request from unauthorized origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply Middleware
app.use(morgan('dev')); // Logging
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logging Middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  
  // Only log body for POST/PUT requests
  if (['POST', 'PUT'].includes(req.method)) {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Import Routes
const memeRoutes = require('./routes/memeRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const interactionRoutes = require('./routes/interactionRoutes');

// Health Check Endpoints
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

// API Routes
app.use('/api/memes', memeRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/interactions', interactionRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Error Handler
app.use((err, req, res, next) => {
  // Log error details
  console.error('Error occurred:', {
    timestamp: new Date().toISOString(),
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
    body: req.body
  });

  // Send error response
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'development' ? {
      stack: err.stack,
      ...err
    } : undefined
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`
🚀 Server is running on port ${PORT}
📱 Environment: ${process.env.NODE_ENV}
🌐 Allowed origins: ${ALLOWED_ORIGINS.join(', ')}
  `);
});

// Graceful Shutdown Handler
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Performing graceful shutdown...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = app;