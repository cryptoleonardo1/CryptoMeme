const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const User = require('./models/User');
const morgan = require('morgan');

dotenv.config();
const app = express();

// Middleware
app.use(morgan('dev'));
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB Test endpoint
app.get('/test-db', async (req, res) => {
  try {
    const testUser = await User.findOne({ telegramId: 'test123' });
    res.json({ 
      status: 'ok', 
      dbConnected: !!testUser,
      user: testUser 
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.get('/test-memes', async (req, res) => {
  try {
    const memes = await Meme.find().limit(5);
    res.json({
      count: memes.length,
      samples: memes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Import routes
const userRoutes = require('./routes/userRoutes');
const memeRoutes = require('./routes/memeRoutes');
const taskRoutes = require('./routes/taskRoutes');
const interactionRoutes = require('./routes/interactionRoutes');

// Route middleware
app.use('/api/users', userRoutes);
app.use('/api/memes', memeRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/interactions', interactionRoutes);

// Start server after DB connection
connectDB().then(() => {
  app.listen(process.env.PORT || 3001, () => {
    console.log(`Server running on port ${process.env.PORT || 3001}`);
  });
});